import { Injectable, CanActivate, Inject, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ErrorCode, Exception } from '@/configs';
import { JWT } from '@/providers/JWT';

@Injectable()
export default class CheckServerGuard implements CanActivate {
	constructor(
		@Inject('JWT') private jwtServer: JWT,
	) { }
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const req: Request = context.switchToHttp().getRequest();

		if (!req.get('Authorization')) {
			throw new Exception('server authorization is not found.', ErrorCode.INVALID_SERVER_AUTHORIZATION);
		}
		const [tokenType, token] = (req.get('Authorization') || '').split(' ');

		if (tokenType === 'JWT') {
			return this.jwtServer.verify(token);
		} else {
			throw new Exception('unknown server authentication.', ErrorCode.INVALID_SERVER_AUTHORIZATION);
		}
	}
}
