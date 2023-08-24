import { HttpException, HttpStatus } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { HttpErrorType, ErrorCode } from './errorCode';

const getStatusByCode = (type?: number | string): number => {
	if (typeof type === 'number') {
		return type;
	} else if (typeof type === 'string') {
		return HttpErrorType[type];
	} else {
		return HttpErrorType['INTERNAL_SERVER_ERROR'];
	}
};

export class Exception extends HttpException {
	public code: string;
	public message: string;
	public source: Array<string> = [];
	public reason?: Record<string, unknown>;

	constructor(message: string | ExceptionInstance, status?: number | keyof typeof ErrorCode, variable?: Record<string, unknown>) {
		super(message, getStatusByCode(status));
		if (typeof message !== 'string') {
			this.message = message.message;
			this.code = message.code;
			this.reason = message.reason;
			this.source = message.source;
		} else {
			this.message = message;
		}
		if (!this.code) {
			this.code = typeof status === 'string' ? status : HttpStatus[status] || 'INTERNAL_SERVER_ERROR';
		}

		if (variable) {
			this.reason = variable;
		}

		const serverName = process.env.SERVER_NAME;

		if (serverName && !this.source.includes(serverName)) {
			this.source.push(serverName);
		}
	}
}

export class GqlException extends GraphQLError {
	constructor(message: string, code: number | keyof typeof ErrorCode, variable?: Record<string, unknown>) {
		super(message, {
			extensions: {
				code,
				reason: variable || {}
			}
		});
	}
}
