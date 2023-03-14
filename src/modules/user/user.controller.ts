import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { User } from '@/decorator';
// import { ValidationPipe } from '@/pipe';
// import { TestInterceptor } from '@/interceptor';

// @UseInterceptors(TestInterceptor)
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(+id, updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(+id);
	}

	// @UseInterceptors(TestInterceptor)
	@Get('test/n')
	// getHello(@User() user: UserEntity): string { //自定义修饰器的使用
	// getHello(@Query(new ValidationPipe) a: string): string { // 管道注册
	async getHello(): Promise<string> {
		return await this.userService.getHello();
	}
}
