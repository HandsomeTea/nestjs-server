import { Injectable, CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as httpContext from 'express-http-context';
import { ErrorCode, Exception } from '@/configs';

@Injectable()
export default class CheckUserGuard implements CanActivate {
	canActivate(): boolean | Promise<boolean> | Observable<boolean> {
		const userId = httpContext.get('userId');

		if (!userId) {
			throw new Exception('there is no user login info found from request!', ErrorCode.USER_REQUEST_UNAUTHORIZED);
		}
		return true;
	}
}
