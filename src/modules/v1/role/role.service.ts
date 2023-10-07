import { RoleDal, UserDal } from '@/dal';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RoleService {
	constructor(
		@Inject('ROLE_DAL') private role: RoleDal,
		@Inject('USER_DAL') private user: UserDal,
	) { }

	async create(role: { name: string, permission: Record<string, Array<string>>, _id?: string }) {
		if (!role._id) {
			return await this.role.create(role);
		} else {
			return await this.role.updateOne(role._id, role);
		}
	}

	async page(option: { keyword?: string, skip?: number, limit?: number }) {
		return await this.role.paging(option);
	}

	async findOne(option: { id: string }) {
		return await this.role.findOne(option);
	}

	async find(option: { id?: Array<string> | string, name?: string }) {
		return await this.role.find(option);
	}

	async delete(id: Array<string>) {
		await this.role.delete(id);
		await this.user.removeRoles(id);
		return;
	}
}
