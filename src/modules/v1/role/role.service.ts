import { RoleDal, UserDal } from '@/dal';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RoleService {
	constructor(
		@Inject('ROLE_DAL') private role: RoleDal,
		@Inject('USER_DAL') private user: UserDal,
	) { }

	async create(role: { name: string, permission: Record<string, Array<string>> }) {
		return await this.role.create(role);
	}

	async update(role: { name: string, permission: Record<string, Array<string>>, _id: string }) {
		return await this.role.updateOne(role._id, role);
	}

	async page(option: { keyword?: string, skip?: number, limit?: number }) {
		return await this.role.paging(option);
	}

	async getPermissions(roleIds: Array<string>) {
		return (await this.role.findByIds(roleIds)).map(role => role.permission);
	}

	async findById(id: string) {
		return await this.role.findById(id);
	}

	async deleteById(id: Array<string> | string) {
		if (!id) {
			return;
		}
		await this.role.deleteById(id);
		const roleIds = Array.isArray(id) ? id : [id];

		for (let s = 0; s < roleIds.length; s++) {
			await this.user.removeRoleById(roleIds[s]);
		}
	}

	async getSelectList() {
		return (await this.role.find({})).map(role => ({ _id: role._id, name: role.name }));
	}
}
