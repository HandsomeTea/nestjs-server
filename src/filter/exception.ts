import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { Exception } from '@/config';

// 只能catch到HttpException类型的throw
@Catch(HttpException)
export default class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException & Exception, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		// const request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		response.status(status).json({
			message: exception.message,
			source: exception.source,
			code: exception.code,
			reason: exception.reason || []
		});

		// trace({
		// 	traceId: httpContext.get('traceId'),
		// 	spanId: httpContext.get('spanId'),
		// 	parentSpanId: httpContext.get('parentSpanId')
		// }, 'http-error').info(`${req.method}: ${req.originalUrl} => \n${JSON.stringify(result, null, '   ')}`);
	}
}
