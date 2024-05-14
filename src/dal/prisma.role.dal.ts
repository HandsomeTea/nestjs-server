import { Inject, Injectable } from '@nestjs/common';
import { Roles } from '@/db/db.models';

@Injectable()
export class RoleDal {
	constructor(
		@Inject('ROLE_MODEL') private role: Roles
	) {
		this.init();
	}

	private getModeledData(role: any): RoleModel {
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
		if ((await this.role.findMany({ where: { type: 'INNER_ADMIN' } })).length === 0) {
			await this.role.create({
				data: {
					type: 'INNER_ADMIN',
					name: 'admin',
					permission: { all: ['*'] }
				}
			});
		}
	}

	async find(option: { id?: string | Array<string>, name?: string }) {
		const { id, name } = option;

		return (await this.role.findMany({
			where: {
				...id ? { id: typeof id === 'string' ? id : { in: id } } : {},
				...name ? { name: { contains: name.toLowerCase() } } : {}
			}
		})).map(this.getModeledData);
	}

	async paging(option: { keyword?: string, skip?: number, limit?: number }) {
		const { keyword, skip = 0, limit = 10 } = option;

		return {
			list: (await this.role.findMany({
				where: {
					...keyword ? { name: { contains: keyword.toLowerCase() } } : {}
				},
				skip,
				take: limit,
				orderBy: {
					createdAt: 'desc'
				}
			})).map(role => this.getModeledData(role)),
			total: await this.role.count({
				where: {
					...keyword ? { name: { contains: keyword.toLowerCase() } } : {}
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

	async delete(id: string | Array<string>) {
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

	async findOne(option: { id?: string, name?: string }) {
		const { id, name } = option;
		const role = await this.role.findFirst({
			where: {
				...id ? { id } : {},
				...name ? { name } : {}
			}
		});

		return role ? this.getModeledData(role) : null;
	}
}

export const RoleDalProvider = {
	provide: 'ROLE_DAL',
	useClass: RoleDal
};
