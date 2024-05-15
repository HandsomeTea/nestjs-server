import { Inject, Injectable } from '@nestjs/common';
import { Users } from '@/db/db.models';
import { displayPhone } from '@coco-sheng/js-tools';

@Injectable()
export class UserDal {
	constructor(
		@Inject('USER_MODEL') private user: Users
	) { }

	private getModeledData(user: any): UserModel {
		return {
			_id: user.id,
			name: user.name,
			...user.phone ? {
				phone: { number: user.phone, verify: user.phoneVerify }
			} : {},
			...user.email ? {
				email: { address: user.email, verify: user.emailVerify }
			} : {},
			...user.passwordBcrypt ? {
				password: {
					bcrypt: user.passwordBcrypt,
					algorithm: user.passwordAlgorithm as PasswordAlgorithm,
					updateAt: user.passwordUpdateAt,
					wrongTimes: user.passwordWrongTimes,
					unLockAt: user.passwordUnlockAt
				}
			} : {},
			type: user.type,
			role: user.role,
			...user.avatarUrl ? {
				avatar: {
					url: user.avatarUrl,
					updateAt: user.avatarUpdateAt
				}
			} : {},
			status: user.status,
			...user.lastLogin ? { lastLogin: user.lastLogin } : {},
			...user.firstLogin ? { firstLogin: user.firstLogin } : {},
			createdAt: user.createdAt,
			updatedAt: user.updatedAt
		};
	}

	async insertOne(data: Omit<UserModel, '_id' | 'createdAt' | 'updatedAt'>): Promise<UserModel> {
		const user = await this.user.create({
			data: {
				name: data.name,
				phone: data.phone.number,
				phoneVerify: Boolean(data.phone?.verify),
				email: data.email?.address,
				emailVerify: Boolean(data.email?.verify),
				passwordBcrypt: data.password?.bcrypt,
				passwordAlgorithm: data.password?.algorithm,
				passwordUpdateAt: data.password?.updateAt,
				type: data.type,
				status: data.status,
				role: data.role
			}
		});

		return this.getModeledData(user);
	}

	async paging(option: { keyword?: string, skip?: number, limit?: number }) {
		const { keyword, skip = 0, limit = 10 } = option;

		return {
			list: (await this.user.findMany({
				where: {
					...keyword ? {
						OR: [{
							name: { contains: keyword.toLowerCase() }
						}, {
							phone: { contains: keyword.toLowerCase() }
						}, {
							email: { contains: keyword.toLowerCase() }
						}]
					} : {},
					id: { not: '0000' }
				},
				skip,
				take: limit, orderBy: { createdAt: 'desc' },
				select: {
					passwordAlgorithm: false,
					passwordBcrypt: false,
					passwordUpdateAt: false,
					passwordUnlockAt: false,
					passwordWrongTimes: false,
					name: true,
					phone: true,
					phoneVerify: true,
					email: true,
					emailVerify: true,
					type: true,
					status: true,
					role: true,
					avatarUrl: true,
					avatarUpdateAt: true,
					lastLogin: true,
					firstLogin: true,
					id: true,
					createdAt: true,
					updatedAt: true
				}
			})).map(a => this.getModeledData(a)),
			total: await this.user.count({
				where: {
					...keyword ? {
						OR: [{
							name: { contains: keyword.toLowerCase() }
						}, {
							phone: { contains: keyword.toLowerCase() }
						}, {
							email: { contains: keyword.toLowerCase() }
						}]
					} : {},
					id: { not: '0000' }
				},
			})
		};
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
				passwordWrongTimes: false,
				name: true,
				phone: true,
				phoneVerify: true,
				email: true,
				emailVerify: true,
				type: true,
				status: true,
				role: true,
				avatarUrl: true,
				avatarUpdateAt: true,
				lastLogin: true,
				firstLogin: true,
				id: true,
				createdAt: true,
				updatedAt: true
			}
		});

		if (!user) {
			return null;
		}
		const result = this.getModeledData(user);
		// await this.cacheServer.setUserById(result);

		return result;
	}

	async updateOne(id: string, update: { name?: string, phone?: string, email?: string, password?: UserModel['password'], type?: Array<UserType>, avatar?: string, role?: Array<string> }) {
		const { name, phone, email, password, type, role, avatar } = update;

		return await this.user.update({
			where: { id, AND: { id: { not: '0000' } } },
			data: {
				...name ? { name } : {},
				...phone ? { phone } : {},
				...email ? { email } : {},
				...password ? { password } : {},
				...Array.isArray(type) && type.length > 0 ? { type } : { type: ['USER'] },
				...Array.isArray(role) && role.length > 0 ? { role } : { role: [] },
				...avatar ? { avatarUrl: avatar, avatarUpdateAt: new Date() } : {}
			}
		});
	}

	async deleteById(id: Array<string> | string) {
		return await this.user.deleteMany({
			where: {
				id: typeof id === 'string' ? id : { in: id },
				AND: { id: { not: '0000' } }
			}
		});
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

		return this.getModeledData(user);
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

		return this.getModeledData(user);
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

	async removeRoleById(roleId: string) {
		const hasRoleUsers = await this.user.findMany({
			where: {
				role: { has: roleId }, AND: { id: { not: '0000' } }
			}
		})

		if (hasRoleUsers.length > 0) {
			for (let s = 0; s < hasRoleUsers.length; s++) {
				await this.user.update({
					where: { id: hasRoleUsers[s].id, AND: { id: { not: '0000' } } },
					data: {
						role: hasRoleUsers[s].role.filter(role => role !== roleId)
					}
				});
			}
		}
	}
}

export const UserDalProvider = {
	provide: 'USER_DAL',
	useClass: UserDal
};
