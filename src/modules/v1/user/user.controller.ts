import { Controller, Post, Body, Get, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, LoginDto } from './dto';
// import { ReqUserInfo } from '@/decorators';
import { ValidationDtoPipe } from '@/pipes';
// import { TestInterceptor } from '@/interceptors';

/** /api/project/service/v1/user */
// @UseInterceptors(TestInterceptor)
@Controller('project/service/v1/user')
export class UserController {
	constructor(private readonly userService: UserService) { }

	// @UseInterceptors(TestInterceptor)
	@Post()
	// @UsePipes(new ValidationDtoPipe())
	// create(@ReqUserInfo() user: Record<string, string>) { //自定义修饰器的使用
	create(@Body() user: CreateUserDto) {
		return this.userService.create(user);
	}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body(new ValidationDtoPipe()) updateUser: UpdateUserDto) {
		return this.userService.update(id, updateUser);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(id);
	}
}

/** /api/projectpub/service/v1/account */
@Controller('projectpub/service/v1/account')
export class AccountPubController {
	constructor(private readonly userService: UserService) { }

	@Post('/login')
	login(@Body() info: LoginDto) {
		return this.userService.login(info);
	}
}
