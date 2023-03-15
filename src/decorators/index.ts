// 自定义修饰器
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 自定义用于获取req上的通用用户数据的修饰器
export const ReqUserInfo = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();

	return request.user || { test: 'test123' };
});
