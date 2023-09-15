import { RoleDal } from '@/dal/role.dal';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RoleService {
	constructor(
		@Inject('ROLE_DAL') private dal: RoleDal
	) { }

	async create(role: { name: string, permission: Record<string, Array<string>> }) {
		return await this.dal.create(role);
	}

	async page(option: { name?: string, skip?: number, limit?: number }) {
		return await this.dal.paging(option);
	}

	async findOne(option: { id: string }) {
		return await this.dal.findOne(option);
	}
}
