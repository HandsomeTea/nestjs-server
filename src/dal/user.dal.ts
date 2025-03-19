import { Inject, Injectable } from '@nestjs/common';
import { displayPhone } from '@coco-sheng/js-tools';
import { Users } from '@/db/db.models';
import { CacheServer } from './cache/cache.interfaces';
import { innerAdminId } from './role.dal';

@Injectable()
export class UserDal {
	constructor(
        @Inject('CACHE_MODEL') private cacheServer: CacheServer,
        @Inject('USER_MODEL') private user: Users
	) { }

	async insertOne(data: Omit<UserModel, '_id' | 'createdAt' | 'updatedAt'>) {
		return await this.user.insertOne(data);
	}

	async paging(option: { keyword?: string, skip?: number, limit?: number }) {
		const { keyword, skip = 0, limit = 10 } = option;

		return await this.user.paging({
			...keyword ? {
				$or: [
					{ name: { $regex: keyword, $options: 'i' } },
					{ 'phone.number': { $regex: keyword, $options: 'i' } },
					{ 'email.address': { $regex: keyword, $options: 'i' } }
				]
			} : {},
			_id: { $ne: innerAdminId }
		}, limit, skip, { createdAt: 'desc' }, { projection: { password: 0 } });
	}

	async findById(id: string) {
		const cacheResult = await this.cacheServer.getUserById(id);

		if (cacheResult) {
			return cacheResult;
		}
		const result = await this.user.findById(id, { projection: { password: 0 } });

		if (!result) {
			return null;
		}
		await this.cacheServer.setUserById(result);
		return result;
	}

	async updateOne(id: string, update: { name?: string, phone?: string, email?: string, password?: UserModel['password'], type?: Array<UserType>, avatar?: string, role?: Array<string> }) {
		const { name, phone, email, password, type, role, avatar } = update;

		const updateData = await this.user.updateOne({ _id: id, $and: [{ _id: { $ne: innerAdminId } }] }, {
			$set: {
				...name ? { name } : {},
				...phone ? { 'phone.number': phone } : {},
				...email ? { 'email.address': email } : {},
				...password ? { password } : {},
				...Array.isArray(type) && type.length > 0 ? { type } : { type: ['user'] },
				...Array.isArray(role) && role.length > 0 ? { role } : { role: [] },
				...avatar ? { avatar: { url: avatar, updateAt: new Date() } } : {}
			}
		});

		if (updateData.modifiedCount === 1) {
			await this.cacheServer.deleteUserById(id);
		}
	}

	async deleteById(id: Array<string> | string) {
		await this.user.deleteMany({
			_id: typeof id === 'string' ? id : { $in: id },
			$and: [{ _id: { $ne: innerAdminId } }]
		});
		await this.cacheServer.deleteUserById(id);
	}

	async create(source: { email?: string, phone?: string, name?: string }, option: { verify: boolean, type: Array<UserType> }) {
		const { email, phone, name } = source;
		const { verify, type } = option;

		return await this.user.insertOne({
			name: name || displayPhone(phone) || email,
			...phone ? { phone: { number: phone, verify } } : {},
			...email ? { email: { address: phone, verify } } : {},
			type,
			status: 'ACTIVE'
		});
	}

	/** 如果传入密码参数，密码必须经过加密算法处理，findOne函数内部不做任何处理 */
	async findOne(option: { email?: string, phone?: string, userId?: string, password?: string }) {
		const { email, phone, userId, password } = option;

		return await this.user.findOne({
			...userId ? { _id: userId } : {},
			...email ? { 'email.address': email } : {},
			...phone ? { 'phone.number': phone } : {},
			...password ? { 'password.bcrypt': password } : {}
		});
	}

	async setPhoneVerify(userId: string, verify?: boolean) {
		await this.user.updateOne({ _id: userId }, {
			$set: {
				'phone.verify': Boolean(verify)
			}
		});
		await this.cacheServer.deleteUserById(userId);
	}

	async setEmailVerify(userId: string, verify?: boolean) {
		await this.user.updateOne({ _id: userId }, {
			$set: {
				'email.verify': Boolean(verify)
			}
		});
		await this.cacheServer.deleteUserById(userId);
	}

	async setUserFirstLogin(userId: string) {
		await this.user.updateOne({ _id: userId }, {
			$set: {
				firstLogin: new Date()
			}
		});
		await this.cacheServer.deleteUserById(userId);
	}

	async setUserLastLogin(userId: string) {
		await this.user.updateOne({ _id: userId }, {
			$set: {
				lastLogin: new Date()
			}
		});
		await this.cacheServer.deleteUserById(userId);
	}

	async removeRoleById(roleId: string | Array<string>) {
		const users = await this.user.find({ _id: { $ne: innerAdminId }, role: roleId });

		if (users.length > 0) {
			await this.user.updateMany({ _id: { $in: users.map(user => user._id.toString()) } }, {
				$pullAll: {
					role: typeof roleId === 'string' ? [roleId] : roleId
				}
			});
			await this.cacheServer.deleteUserById(users.map(user => user._id.toString()));
		}
	}
}

export const UserDalProvider = {
	provide: 'USER_DAL',
	useClass: UserDal
};
