import { Inject, Injectable } from '@nestjs/common';
import { User } from '@/db/db.models';
import { CacheServer } from './cache/cache.interfaces';
import { displayPhone } from '@coco-sheng/js-tools';

@Injectable()
export class UserDal {
	constructor(
		@Inject('CACHE_MODEL') private cacheServer: CacheServer,
		@Inject('USER_MODEL') private user: User
	) { }

	async insertOne(data: Omit<UserModel, '_id' | 'createdAt' | 'updatedAt'>) {
		return await this.user.insertOne(data);
	}

	async find() {
		return await this.user.find();
	}

	async findById(id: string) {
		const cacheResult = await this.cacheServer.getUserById(id);

		if (cacheResult) {
			return cacheResult;
		}
		const result = await this.user.findById(id);

		if (!result) {
			return null;
		}
		await this.cacheServer.setUserById(result);
		return result;
	}

	async updateOne(id: string, updateUser: { name?: string, phone?: string, email?: string, password?: UserModel['password'], role?: Array<string>, avatar?: string }) {
		const { name, phone, email, password, role, avatar } = updateUser;

		return await this.user.updateOne({ _id: id }, {
			$set: {
				...name ? { name } : {},
				...phone ? { 'phone.number': phone } : {},
				...email ? { 'email.address': email } : {},
				...password ? { password } : {},
				...Array.isArray(role) && role.length > 0 ? { role } : { role: ['user'] },
				...avatar ? { avatar: { url: avatar, updateAt: new Date() } } : {}
			}
		});
	}

	async deleteOne(id: string) {
		return await this.user.deleteOne({ _id: id });
	}

	async create(source: { email?: string, phone?: string, name?: string }, option: { verify: boolean, role: Array<'user'> }) {
		const { email, phone, name } = source;
		const { verify, role } = option;

		return await this.user.insertOne({
			name: name || displayPhone(phone) || email,
			...phone ? { phone: { number: phone, verify } } : {},
			...email ? { email: { address: phone, verify } } : {},
			role,
			status: 'active'
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
	}

	async setEmailVerify(userId: string, verify?: boolean) {
		await this.user.updateOne({ _id: userId }, {
			$set: {
				'email.verify': Boolean(verify)
			}
		});
	}

	async setUserFirstLogin(userId: string) {
		await this.user.updateOne({ _id: userId }, {
			$set: {
				firstLogin: new Date()
			}
		});
	}

	async setUserLastLogin(userId: string) {
		await this.user.updateOne({ _id: userId }, {
			$set: {
				lastLogin: new Date()
			}
		});
	}
}

export const UserDalProvider = {
	provide: 'USER_DAL',
	useClass: UserDal
};
