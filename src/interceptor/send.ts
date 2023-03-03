// 后置拦截器
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export default class TransformResponse implements NestInterceptor {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		// const controller = context.getClass().name; // 取得controller name
		// const handler = context.getHandler().name; // 取得method name

		// console.log(123);
		// return next.handle().pipe(
		// 	map(data => // 原response內容
		// 	{
		// 		const resss = { // 改变response內容
		// 			controller,
		// 			handler,
		// 			data,
		// 		};
		// 		console.log(resss);
		// 		return resss
		// 	}),
		// );
		return next.handle().pipe(
			map(value => {
				return value === null ? '' : value;
			})
		);
	}
}
