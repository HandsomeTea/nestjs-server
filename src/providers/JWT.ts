import { ErrorCode, Exception } from '@/configs';
import * as jwt from 'jsonwebtoken';
import { Injectable, Module } from '@nestjs/common';

@Injectable()
export class JWT {
	constructor() {
		this.init();
	}

	private init() {
		if (!this.secret) {
			throw new Exception('JWT secret is required!', ErrorCode.INTERNAL_SERVER_ERROR);
		}

		if (!this.jwtSubject || !this.jwtIssure) {
			throw new Exception('JWT source data is required!', ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}

	private get jwtIssure() {
		return process.env.JWT_ISSURE;
	}

	private get jwtSubject() {
		return process.env.JWT_SUBJECT;
	}

	private get secret() {
		return process.env.JWT_SECRET;
	}

	/**
	 * 生成JWT的token
	 * 用于服务期间访问的验证
	 * @returns
	 * @memberof JWT
	 */
	sign() {
		return 'JWT ' + jwt.sign({ iss: this.jwtIssure, sub: this.jwtSubject }, this.secret, {
			expiresIn: '1h',
			noTimestamp: true,
			header: {
				alg: 'HS256',
				typ: 'JWT'
			}
		});
	}

	/**
	 * 验证JWT
	 */
	verify(jsonWebToken: string) {
		try {
			jwt.verify(jsonWebToken, this.secret, {
				issuer: this.jwtIssure,
				subject: this.jwtSubject,
				algorithms: ['HS256']
			});
			return true;
		} catch (e) {
			throw new Exception(e, ErrorCode.SERVER_REQUEST_UNAUTHORIZED);
		}
	}
}

const JwtProvider = {
	provide: 'JWT',
	useClass: JWT
};

@Module({
	providers: [JwtProvider],
	exports: [JwtProvider]
})
export class JwtModule { }
