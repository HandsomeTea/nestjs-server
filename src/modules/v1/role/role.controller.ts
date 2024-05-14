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
	getList(@Query() query: { skip?: string, limit?: string, keyword?: string }) {
		return this.service.page({
			...query.skip ? { skip: parseInt(query.skip) } : {},
			...query.limit ? { limit: parseInt(query.limit) } : {},
			keyword: query.keyword
		});
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
