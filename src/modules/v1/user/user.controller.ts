import { Controller, Post, Body, Get, Patch, Param, Delete, Query, Sse } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, LoginDto } from './dto';
// import { ReqUserInfo } from '@/decorators';
import { ValidationDtoPipe } from '@/pipes';
import { Observable } from 'rxjs';
import * as EventEmitter from 'events';
// import { TestInterceptor } from '@/interceptors';

/** /api/project/service/v1/user */
// @UseInterceptors(TestInterceptor)
@Controller('project/service/v1/user')
export class UserController {
	constructor(private readonly service: UserService) { }

	// @UseInterceptors(TestInterceptor)
	@Post()
	// @UsePipes(new ValidationDtoPipe())
	// create(@ReqUserInfo() user: Record<string, string>) { //自定义修饰器的使用
	create(@Body() user: CreateUserDto) {
		return this.service.create(user);
	}

	@Sse()
	sse(): Observable<MessageEvent> { // 必须返回一个Observable
		const myEmitter = new EventEmitter(); // 注意局部定义
		const eventName = 'send';
		let count = 0;

		const timer = setInterval(() => {
			count++;
			myEmitter.emit('send', { count });

			if (count === 5) {
				clearInterval(timer);
				myEmitter.emit('send', { streamEnd: true });
				myEmitter.removeListener('send', () => null);
			}
		}, 1000);

		// fn(myEmitter, eventName, () => {
		// 	myEmitter.emit(eventName, { streamEnd: true });
		// 	myEmitter.removeListener(eventName, () => null);
		// });

		return new Observable<MessageEvent>((observer) => {
			myEmitter.on(eventName, data => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				observer.next({ data }); // 返回的数据必须加一个为data的key，这是sse标准，将这个key加在了发送数据前的最后一步
			});
		});
	}

	@Get()
	getList(@Query() query: { skip?: number, limit?: number, keyword?: string }) {
		return this.service.page(query);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.service.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body(new ValidationDtoPipe()) updateUser: UpdateUserDto) {
		return this.service.update(id, updateUser);
	}

	@Delete()
	remove(@Body('id') id: Array<string>) {
		return this.service.remove(id);
	}
}

/** /api/projectpub/service/v1/account */
@Controller('projectpub/service/v1/account')
export class AccountPubController {
	constructor(private readonly service: UserService) { }

	/**
	 * @api {post} /api/projectpub/service/v1/account/login 登录
	 * @apiName 登录
	 * @apiGroup Account
	 * @apiVersion 1.0.0
	 * @apiBody {string} type 登录方式，取值：pwd，code，resume
	 * @apiBody {string} [payload.code] 验证码
	 * @apiBody {string} [payload.account] 手机号/邮箱
	 * @apiBody {string} [payload.password] 密码
	 * @apiBody {string} [payload.token] 登录的token
	 */
	@Post('/login')
	login(@Body() info: LoginDto) {
		return this.service.login(info);
	}
}
