import { Inject, Injectable } from '@nestjs/common';
import { Roles } from '@/db/db.models';
import { CacheServer } from './cache/cache.interfaces';

@Injectable()
export class RoleDal {
	constructor(
		@Inject('CACHE_MODEL') private cacheServer: CacheServer,
		@Inject('ROLE_MODEL') private role: Roles
	) { }

	async find(option: { id?: string | Array<string> }) {
		const { id } = option;

		return await this.role.find({
			...id ? { _id: typeof id === 'string' ? id : { $in: id } } : {}
		});
	}

	async paging(option: { name?: string, skip?: number, limit?: number }) {
		const { name, skip = 0, limit = 10 } = option;

		return await this.role.paging({
			...name ? { name: { $regex: name, $options: 'i' } } : {}
		}, limit, skip, { createdAt: 'desc' });
	}

	async updateOne(id: string, update: { name?: string, permission?: Record<string, Array<string>> }) {
		const { name, permission } = update;

		return await this.role.updateOne({ _id: id }, {
			$set: {
				...name ? { name } : {},
				...permission ? { permission } : {}
			}
		});
	}

	async delete(id: string | Array<string>) {
		return await this.role.deleteOne({ _id: typeof id === 'string' ? id : { $in: id } });
	}

	async create(role: { name: string, permission: Record<string, Array<string>> }) {
		return await this.role.insertOne(role);
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
