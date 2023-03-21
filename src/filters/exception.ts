import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import * as httpContext from 'express-http-context';
import { Exception, trace } from '@/configs';

// 只能catch到HttpException类型的throw
@Catch(HttpException)
export default class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException & Exception, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();
		const result = {
			message: exception.message,
			code: exception.code || HttpStatus[status],
			reason: exception.reason || {},
			source: exception.source || [process.env.SERVER_NAME]
		};

		trace(
			{
				traceId: httpContext.get('traceId'),
				spanId: httpContext.get('spanId'),
				parentSpanId: httpContext.get('parentSpanId')
			},
			'http-error'
		).info(`${request.method}: ${request.originalUrl} => \n${JSON.stringify(result, null, '   ')}`);

		response.status(status).json(result);
	}
}
