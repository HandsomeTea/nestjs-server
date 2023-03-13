/**
 * 参考链接
 * https://www.nestjs.com.cn/first-steps
 * https://blog.csdn.net/lxy869718069/article/details/103960790
 */
import { NestFactory } from '@nestjs/core';
import * as httpContext from 'express-http-context';
import * as compression from 'compression';

import { V1AppModule } from '@/modules';
import { requestHandle } from '@/middlewares';
import { ResponseHandle /*, TestInterceptor*/ } from '@/interceptors';
import { ErrorHandle } from '@/filters';
import { updateOrCreateLogInstance } from './configs';
// import { JWTCheckHandle } from '@/guard';
// import { ValidationPipe } from '@/pipe';

(async () => {
	const app = await NestFactory.create(V1AppModule);

	/**
	 * ------------------------------------异常过滤器------------------------------------
	 * ---发起请求---中间件---守卫---拦截器---管道---controller---service--拦截器---请求结束---
	 */

	app.useGlobalFilters(new ErrorHandle());
	app.use(compression());
	app.use(httpContext.middleware);
	app.use(requestHandle);
	// app.useGlobalGuards(new JWTCheckHandle());
	// app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new ResponseHandle() /*, new TestInterceptor()*/);
	app.setGlobalPrefix('api/v1');
	updateOrCreateLogInstance();
	await app.listen(process.env.PORT);
})();
