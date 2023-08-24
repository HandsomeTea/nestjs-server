import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response, Request } from 'express';
import * as httpContext from 'express-http-context';
import { Exception, trace } from '@/configs';

// 只能catch到HttpException类型的throw
@Catch(HttpException)
export default class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException & Exception, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();

		if (request) {
			const errorResponse = exception.getResponse();
			const result: ExceptionInstance = {
				status: exception.getStatus(),
				message: '',
				code: exception.code || 'INTERNAL_SERVER_ERROR',
				reason: exception.reason || {},
				source: [...new Set([...exception.source || [], process.env.SERVER_NAME])]
			};

			if (typeof errorResponse === 'string') {
				result.message = errorResponse;
			} else {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				result.message = errorResponse.message;
			}
			trace(
				{
					traceId: httpContext.get('traceId'),
					spanId: httpContext.get('spanId'),
					parentSpanId: httpContext.get('parentSpanId')
				},
				'http-error'
			).info(`${request.method}: ${request.originalUrl} => \n${JSON.stringify(result, null, '   ')}`);
			const response = ctx.getResponse<Response>();

			response.status(result.status).json(result);
		}
	}
}
