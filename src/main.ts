/**
 * 参考链接
 * https://www.nestjs.com.cn/first-steps
 * https://blog.csdn.net/lxy869718069/article/details/103960790
 */
import { NestFactory } from '@nestjs/core';
import { RootModule } from '@/module';
import { requestHandle } from '@/middleware';
import { ResponseHandle/*, TestInterceptor*/ } from '@/interceptor';
import { ErrorHandle } from '@/filter';
// import { JWTCheckHandle } from '@/guard';
// import { ValidationPipe } from '@/pipe';

async function bootstrap() {
	const app = await NestFactory.create(RootModule);

	/**
	 * ------------------------------------异常过滤器------------------------------------
	 * ---发起请求---中间件---守卫---拦截器---管道---controller---service--拦截器---请求结束---
	 */

	app.useGlobalFilters(new ErrorHandle());
	app.use(requestHandle);
	// app.useGlobalGuards(new JWTCheckHandle());
	// app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new ResponseHandle()/*, new TestInterceptor()*/);
	await app.listen(3003);
}
bootstrap();
