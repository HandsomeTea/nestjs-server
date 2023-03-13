import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export default class CheckJWTGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const req: Request = context.switchToHttp().getRequest();

		if (this.whiteUrlList.includes(req.path)) {
			return true;
		}
		if (req.headers.authorization) {
			const [authType /*, authToken*/] = req.headers.authorization.split(' ');

			if (authType !== 'JWT') {
				throw new HttpException('Bad request(wrong Authorization)! Refused.', HttpStatus.UNAUTHORIZED);
			} else {
				// return JWT.verify(authToken);
				return true;
			}
		} else {
			throw new HttpException('Bad request(no Authorization)! Refused.', HttpStatus.BAD_REQUEST);
		}
	}

	private get whiteUrlList() {
		return ['/login'];
	}
}
