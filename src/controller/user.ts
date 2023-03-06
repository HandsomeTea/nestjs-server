import { Controller, Get } from '@nestjs/common';
import { UserService } from '@/service';
// import { User } from '@/decorator';
// import { ValidationPipe } from '@/pipe';
// import { TestInterceptor } from '@/interceptor';

// @UseInterceptors(TestInterceptor)
@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	// @UseInterceptors(TestInterceptor)
	@Get('/test')
	// getHello(@User() user: UserEntity): string { //自定义修饰器的使用
	// getHello(@Query(new ValidationPipe) a: string): string { // 管道注册
	getHello(): string {
		return this.userService.getHello();
	}
}
