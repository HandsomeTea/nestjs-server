import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('project/service/v1/role')
export class RoleController {
	constructor(private readonly service: RoleService) { }

	@Post()
	create(@Body() role: { name: string, data: Record<string, Array<string>> }) {
		return this.service.create({ name: role.name, permission: role.data });
	}

	@Put()
	update(@Body() role: { name: string, data: Record<string, Array<string>>, id: string }) {
		return this.service.update({ name: role.name, permission: role.data, _id: role.id });
	}

	@Get()
	paging(@Query() query: { skip?: string, limit?: string, keyword?: string }) {
		return this.service.page({
			...query.skip ? { skip: parseInt(query.skip) } : {},
			...query.limit ? { limit: parseInt(query.limit) } : {},
			keyword: query.keyword
		});
	}

	@Get('/permission')
	getPermissionByUserRoleList(@Query() roleId: { id: Array<string> }) {
		return this.service.getPermissions(roleId.id);
	}

	@Get('/select')
	getDropdownList() {
		return this.service.getSelectList();
	}

	@Get(':id')
	findRole(@Param('id') id: string) {
		return this.service.findById(id);
	}

	@Delete()
	deleteRole(@Body('id') id: Array<string> | string) {
		return this.service.deleteById(id);
	}
}
