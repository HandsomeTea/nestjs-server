import { Inject, Injectable } from '@nestjs/common';
import { Users } from '@/db/db.models';
import { displayPhone } from '@coco-sheng/js-tools';

@Injectable()
export class UserDal {
	constructor(
        @Inject('USER_MODEL') private user: Users
	) { }

	async insertOne(data: Omit<UserModel, '_id' | 'createdAt' | 'updatedAt'>) {
		return await this.user.create({
			data: {
				name: data.name,
				phone: data.phone.number,
				phoneVerify: Boolean(data.phone.verify),
				email: data.email.address,
				emailVerify: Boolean(data.email.verify),
				passwordBcrypt: data.password.bcrypt,
				passwordAlgorithm: data.password.algorithm,
				passwordUpdateAt: data.password.updateAt,
				type: data.type,
				status: data.status,
				role: data.role
			}
		});
	}

	async paging(option: { keyword?: string, skip?: number, limit?: number }) {
		const { keyword, skip = 0, limit = 10 } = option;

		return await this.user.findMany({
			where: {
				...keyword ? {
					OR: [{
						name: { contains: keyword.toLowerCase() }
					}, {
						phone: { contains: keyword.toLowerCase() }
					}, {
						email: { contains: keyword.toLowerCase() }
					}]
				} : {}
			},
			skip,
			take: limit, orderBy: { createdAt: 'desc' },
			select: {
				passwordAlgorithm: false,
				passwordBcrypt: false,
				passwordUpdateAt: false,
				passwordUnlockAt: false,
				passwordWrongTimes: false
			}
		});
	}

	async findById(id: string): Promise<UserModel | null> {
		// const cacheResult = await this.cacheServer.getUserById(id);

		// if (cacheResult) {
		//     return cacheResult;
		// }
		const user = await this.user.findFirst({
			where: { id },
			select: {
				passwordAlgorithm: false,
				passwordBcrypt: false,
				passwordUpdateAt: false,
				passwordUnlockAt: false,
				passwordWrongTimes: false
			}
		});

		if (!user) {
			return null;
		}
		const result = {

		} as UserModel;
		// await this.cacheServer.setUserById(result);

		return result;
	}

	async updateOne(id: string, update: { name?: string, phone?: string, email?: string, password?: UserModel['password'], type?: Array<UserType>, avatar?: string }) {
		const { name, phone, email, password, type, avatar } = update;

		return await this.user.update({
			where: { id },
			data: {
				...name ? { name } : {},
				...phone ? { phone } : {},
				...email ? { email } : {},
				...password ? { password } : {},
				...Array.isArray(type) && type.length > 0 ? { type } : { type: ['USER'] },
				...avatar ? { avatarUrl: avatar, avatarUpdateAt: new Date() } : {}
			}
		});
	}

	async deleteMany(id: Array<string>) {
		return await this.user.deleteMany({ where: { id: { in: id } } });
	}

	async create(source: { email?: string, phone?: string, name?: string }, option: { verify: boolean, type: Array<UserType> }): Promise<UserModel> {
		const { email, phone, name } = source;
		const { verify, type } = option;

		const user = await this.user.create({
			data: {
				name: name || displayPhone(phone) || email,
				...phone ? { phone, phoneVerify: verify } : {},
				...email ? { email, emailVerify: verify } : {},
				type,
				status: 'ACTIVE'
			}
		});

		return {

		} as UserModel;
	}

	/** 如果传入密码参数，密码必须经过加密算法处理，findOne函数内部不做任何处理 */
	async findOne(option: { email?: string, phone?: string, userId?: string, password?: string }): Promise<UserModel | null> {
		const { email, phone, userId, password } = option;
		const user = await this.user.findFirst({
			where: {
				...userId ? { id: userId } : {},
				...email ? { email } : {},
				...phone ? { phone } : {},
				...password ? { passwordBcrypt: password } : {}
			}
		});

		if (!user) {
			return null;
		}

		return {

		} as UserModel;
	}

	async setPhoneVerify(userId: string, verify?: boolean) {
		await this.user.update({
			where: { id: userId },
			data: {
				phoneVerify: Boolean(verify)
			}
		});
	}

	async setEmailVerify(userId: string, verify?: boolean) {
		await this.user.update({
			where: { id: userId },
			data: {
				emailVerify: Boolean(verify)
			}
		});
	}

	async setUserFirstLogin(userId: string) {
		await this.user.update({
			where: { id: userId },
			data: {
				firstLogin: new Date()
			}
		});
	}

	async setUserLastLogin(userId: string) {
		await this.user.update({
			where: { id: userId },
			data: {
				lastLogin: new Date()
			}
		});
	}

	async removeRoles(roleIds: Array<string>) {
		await this.user.updateMany({
			data: {
				role: roleIds
			}
		});
	}
}

export const UserDalProvider = {
	provide: 'USER_DAL',
	useClass: UserDal
};
