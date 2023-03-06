// 后置拦截器，在请求结束前执行
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as httpContext from 'express-http-context';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request /*, Response*/ } from 'express';
import { trace } from '@/config';

@Injectable()
export default class TransformResponse implements NestInterceptor {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const ctx = context.switchToHttp();
		// const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		return next.handle().pipe(
			map(data => {
				// 原response內容
				trace(
					{
						traceId: httpContext.get('traceId'),
						spanId: httpContext.get('spanId'),
						parentSpanId: httpContext.get('parentSpanId')
					},
					'return-response'
				).info(`${request.method}: ${request.originalUrl} => \n${JSON.stringify(data, null, '   ')}`);
				return data;
			})
		);
	}
}
