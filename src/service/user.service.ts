import { Injectable } from '@nestjs/common';
import { HttpError, Exception } from '@/config';

@Injectable()
export class UserService {
	getHello(): string {
		throw new Exception('cuo le', HttpError.BE_LOGOUT);
		// throw new Exception('cuo le', HttpStatus.BAD_GATEWAY, ['213123221']);
		// return 'Hello World!';
	}
}
