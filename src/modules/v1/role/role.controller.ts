import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('project/service/v1/role')
export class RoleController {
	constructor(private readonly service: RoleService) { }

	@Post()
	create(@Body() role: { name: string, data: Record<string, Array<string>>, id?: string }) {
		return this.service.create({ name: role.name, permission: role.data, _id: role.id });
	}

	@Get()
	getList(@Query() query: { skip?: number, limit?: number, keyword?: string }) {
		return this.service.page(query);
	}

	@Get('/search')
	search(@Query() query: { id?: Array<string>, name?: string }) {
		return this.service.find(query);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.service.findOne({ id });
	}

	@Delete()
	delete(@Body('id') id: Array<string>) {
		return this.service.delete(id);
	}
}
