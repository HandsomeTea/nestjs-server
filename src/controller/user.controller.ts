import { Controller, Get } from '@nestjs/common';
import { UserService } from '@/service';
// import { ValidationPipe } from '@/pipe';

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('/test')
	// getHello(@Query(new ValidationPipe) a: string): string { // 管道注册
	getHello(): string {
		return this.userService.getHello();
	}
}
