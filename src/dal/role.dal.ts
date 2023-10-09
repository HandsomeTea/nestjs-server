import { Inject, Injectable } from '@nestjs/common';
import { Roles } from '@/db/db.models';

@Injectable()
export class RoleDal {
	constructor(
		@Inject('ROLE_MODEL') private role: Roles
	) {
		this.init();
	}

	private async init() {
		if ((await this.role.find({ type: 'inner-admin' })).length === 0) {
			await this.role.insertOne({
				type: 'inner-admin',
				name: 'admin',
				permission: { all: [] }
			});
		}
	}

	async find(option: { id?: string | Array<string>, name?: string }) {
		const { id, name } = option;

		return await this.role.find({
			...id ? { _id: typeof id === 'string' ? id : { $in: id } } : {},
			...name ? { name: { $regex: name, $options: 'i' } } : {}
		});
	}

	async paging(option: { keyword?: string, skip?: number, limit?: number }) {
		const { keyword, skip = 0, limit = 10 } = option;

		return await this.role.paging({
			...keyword ? { name: { $regex: keyword, $options: 'i' } } : {}
		}, limit, skip, { createdAt: 'desc' });
	}

	async updateOne(id: string, update: { name?: string, permission?: Record<string, Array<string>> }) {
		const { name, permission } = update;

		return await this.role.updateOne({ _id: id, type: { $ne: 'inner-admin' } }, {
			$set: {
				...name ? { name } : {},
				...permission ? { permission } : {}
			}
		});
	}

	async delete(id: string | Array<string>) {
		return await this.role.deleteOne({ _id: typeof id === 'string' ? id : { $in: id }, type: { $ne: 'inner-admin' } });
	}

	async create(role: { name: string, permission: Record<string, Array<string>> }) {
		return await this.role.insertOne({ ...role, type: 'customer' });
	}

	async findOne(option: { id?: string, name?: string }) {
		const { id, name } = option;

		return await this.role.findOne({
			...id ? { _id: id } : {},
			...name ? { name } : {}
		});
	}
}

export const RoleDalProvider = {
	provide: 'ROLE_DAL',
	useClass: RoleDal
};
