import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpErrorType, HttpError } from './errorCode';

const getStatusByCode = (type: number | string): number => {
	if (typeof type === 'number') {
		return type;
	} else {
		return HttpErrorType[type];
	}
};

export default class Exception extends HttpException {
	public source: Array<string> = [];
	public code: string;
	public reason?: Record<string, unknown>;

	constructor(message: string, status: number | keyof typeof HttpError, variable?: Record<string, unknown>) {
		super(message, getStatusByCode(status));
		this.code = typeof status === 'string' ? status : HttpStatus[status];

		if (variable) {
			this.reason = variable;
		}

		// const serverName = getENV('SERVER_NAME');

		// if (serverName && !this.source.includes(serverName)) {
		// 	this.source.push(serverName);
		// }
	}
}
