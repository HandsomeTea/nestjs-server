/**
 * 参考链接
 * https://www.nestjs.com.cn/first-steps
 * https://blog.csdn.net/lxy869718069/article/details/103960790
 */
import { NestFactory } from '@nestjs/core';
import * as httpContext from 'express-http-context';
import * as compression from 'compression';
// import * as csurf from 'csurf';
import { V1AppModule } from '@/modules';
import { requestHandle } from '@/middlewares';
import { ResponseHandle /*, TestInterceptor*/ } from '@/interceptors';
import { ErrorHandle } from '@/filters';
import { updateOrCreateLogInstance, system } from '@/configs';
// import { JWTCheckHandle } from '@/guard';
// import { ValidationPipe } from '@/pipe';

(async () => {
	updateOrCreateLogInstance(); // 日志初始化

	const app = await NestFactory.create(V1AppModule, {
		logger: system('internal')
	});

	/**
	 * ------------------------------------异常过滤器------------------------------------
	 * ---发起请求---中间件---守卫---拦截器---管道---controller---service--拦截器---请求结束---
	 */

	app.enableCors();
	app.setGlobalPrefix('api/v1');

	/** 全局错误捕获 */
	app.useGlobalFilters(new ErrorHandle());

	/** 中间件 */
	app.use(
		// csurf(),
		compression(),
		httpContext.middleware,
		requestHandle
	);

	/** 守卫 */
	// app.useGlobalGuards(new JWTCheckHandle());

	/** 全局管道 */
	// app.useGlobalPipes(new ValidationPipe());

	/** 后置拦截器 */
	app.useGlobalInterceptors(new ResponseHandle() /*, new TestInterceptor()*/);

	await app.listen(process.env.PORT, async () => {
		system('startup').debug(`nest server is running at ${await app.getUrl()}`);
	});
})();
