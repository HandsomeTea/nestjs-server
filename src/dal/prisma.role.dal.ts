import { Inject, Injectable } from '@nestjs/common';
import { Roles, Users } from '@/db/db.models';
import { passwordEncrypted } from '@coco-sheng/js-tools';

@Injectable()
export class RoleDal {
	constructor(
		@Inject('ROLE_MODEL') private role: Roles,
		@Inject('USER_MODEL') private user: Users
	) {
		this.init();
	}

	private getModeledData(role?: any): RoleModel {
		if (!role) {
			return null;
		}
		return {
			_id: role.id,
			name: role.name,
			permission: role.permission,
			type: role.type,
			createdAt: role.createdAt,
			updatedAt: role.updatedAt
		};
	}

	private async init() {
		let innerRole = await this.role.findFirst({ where: { type: 'INNER_ADMIN' } });

		if (!innerRole) {
			innerRole = await this.role.create({
				data: {
					type: 'INNER_ADMIN',
					name: 'admin',
					permission: { all: ['*'] }
				}
			});
		}
		const user = await this.user.findFirst({
			where: {
				role: { has: innerRole.id }
			}
		});

		if (!user) {
			await this.user.create({
				data: {
					id: '0000',
					name: 'admin',
					phone: '13800000000',
					phoneVerify: true,
					type: ['ADMIN'],
					status: 'ACTIVE',
					role: [innerRole.id],
					...(() => {
						const pwd = passwordEncrypted('12345678');

						return {
							passwordBcrypt: pwd.encrypted,
							passwordAlgorithm: pwd.algorithm,
							passwordUpdateAt: new Date()
						};
					})()
				}
			});
		}
	}

	async find(option: { name?: string }) {
		const { name } = option;

		return (await this.role.findMany({
			where: {
				...name ? { name: { contains: name.toLowerCase() } } : {},
				type: { not: 'INNER_ADMIN' }
			}
		})).map(role => this.getModeledData(role));
	}

	async findById(id: string) {
		return this.getModeledData(await this.role.findFirst({
			where: {
				id,
				type: { not: 'INNER_ADMIN' }
			}
		}));
	}

	async findByIds(ids: Array<string>) {
		return (await this.role.findMany({
			where: {
				id: { in: ids }
			}
		})).map(this.getModeledData);
	}

	async paging(option: { keyword?: string, skip?: number, limit?: number }) {
		const { keyword, skip = 0, limit = 10 } = option;

		return {
			list: (await this.role.findMany({
				where: {
					...keyword ? { name: { contains: keyword.toLowerCase() } } : {},
					type: { not: 'INNER_ADMIN' }
				},
				skip,
				take: limit,
				orderBy: {
					createdAt: 'desc'
				}
			})).map(role => this.getModeledData(role)),
			total: await this.role.count({
				where: {
					...keyword ? { name: { contains: keyword.toLowerCase() } } : {},
					type: { not: 'INNER_ADMIN' }
				}
			})
		};
	}

	async updateOne(id: string, update: { name?: string, permission?: Record<string, Array<string>> }) {
		const { name, permission } = update;

		return await this.role.update({
			where: {
				id,
				type: { not: 'INNER_ADMIN' }
			},
			data: {
				...name ? { name } : {},
				...permission ? { permission } : {}
			}
		});
	}

	async deleteByIds(id: string | Array<string>) {
		if (typeof id === 'string') {
			return await this.role.delete({
				where: {
					id,
					type: { not: 'INNER_ADMIN' }
				}
			});
		} else if (Array.isArray(id) && id.length > 0) {
			return await this.role.deleteMany({
				where: {
					id: { in: id },
					type: { not: 'INNER_ADMIN' }
				}
			});
		}
	}

	async create(role: { name: string, permission: Record<string, Array<string>> }) {
		const result = await this.role.create({ data: { ...role, type: 'CUSTOMER' } });

		return this.getModeledData(result);
	}
}

export const RoleDalProvider = {
	provide: 'ROLE_DAL',
	useClass: RoleDal
};
