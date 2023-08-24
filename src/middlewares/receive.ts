import { Request, Response, NextFunction } from 'express';
import * as httpContext from 'express-http-context';
import { trace, traceId } from '@/configs';

const filteNotAllown = (str?: string): string | void => {
	if (str) {
		str = str.trim();
		if (str && str !== 'undefined' && str !== 'null') {
			return str;
		}
	}
};

/**
 * 服务器接收到请求的相关处理
 */
export default (req: Request, _res: Response, next: NextFunction): void => {
	httpContext.set('traceId', filteNotAllown(req.get('x-b3-traceid')) || traceId());
	httpContext.set('parentSpanId', filteNotAllown(req.get('x-b3-parentspanid')) || '');
	httpContext.set('spanId', filteNotAllown(req.get('x-b3-spanid')) || traceId());
	httpContext.set('userId', filteNotAllown(req.get('x-user')) || '');
	httpContext.set('token', filteNotAllown(req.get('x-auth')) || '');

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if (req._parsedUrl.pathname === process.env.GQL_Path) {
		return next();
	}

	let _datas = `\nheader: ${JSON.stringify(req.headers, null, '   ')}`;

	if (req.body && Object.getOwnPropertyNames(req.body).length > 0) {
		_datas += `\nbody: ${JSON.stringify(req.body, null, '   ')}`;
	}
	if (req.query && Object.getOwnPropertyNames(req.query).length > 0) {
		_datas += `\nquery: ${JSON.stringify(req.query, null, '   ')}`;
	}
	if (req.params && Object.getOwnPropertyNames(req.params).length > 0) {
		_datas += `\nparams: ${JSON.stringify(req.params, null, '   ')}`;
	}

	trace(
		{
			traceId: httpContext.get('traceId'),
			spanId: httpContext.get('spanId'),
			parentSpanId: httpContext.get('parentSpanId')
		},
		'http-request'
	).info(`${req.method}: ${req.originalUrl} ${_datas}`);

	next();
};
