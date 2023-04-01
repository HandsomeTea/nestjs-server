// 后置拦截器，在请求结束前执行
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as httpContext from 'express-http-context';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request /*, Response*/ } from 'express';
import { trace } from '@/configs';

@Injectable()
export default class TransformResponse implements NestInterceptor {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const ctx = context.switchToHttp();
		// const response = ctx.getResponse<Response>();

		return next.handle().pipe(
			map(data => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				if (ctx.contextType === 'http') {
					const request = ctx.getRequest<Request>();

					trace(
						{
							traceId: httpContext.get('traceId'),
							spanId: httpContext.get('spanId'),
							parentSpanId: httpContext.get('parentSpanId')
						},
						'http-response'
					).info(`${request.method}: ${request.originalUrl} => \n${JSON.stringify(data, null, '   ')}`);
				}

				return data;
			})
		);
	}
}
