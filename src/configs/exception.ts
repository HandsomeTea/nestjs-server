import { HttpException, HttpStatus } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { HttpErrorType, ErrorCode } from './errorCode';

const getStatusByCode = (type: number | string): number => {
	if (typeof type === 'number') {
		return type;
	} else {
		return HttpErrorType[type];
	}
};

export class Exception extends HttpException {
	public source: Array<string> = [];
	public code: string;
	public reason?: Record<string, unknown>;

	constructor(message: string, status: number | keyof typeof ErrorCode, variable?: Record<string, unknown>) {
		super(message, getStatusByCode(status));
		this.code = typeof status === 'string' ? status : HttpStatus[status];

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
