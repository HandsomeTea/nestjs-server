import { Inject, Injectable } from '@nestjs/common';
import { UserTokens } from '@/db/db.models';
// import { CacheServer } from './cache/cache.interfaces';

@Injectable()
export class UserTokenDal {
	constructor(
		// @Inject('CACHE_MODEL') private cacheServer: CacheServer,
		@Inject('USER_TOKEN_MODEL') private userToken: UserTokens
	) { }

	async insertOne(token: { userId: string, hashedToken: string }) {
		await this.userToken.insertOne(token);
	}

	async delete(query: { userId?: string }) {
		const { userId } = query;

		await this.userToken.deleteMany({
			...userId ? { userId } : {}
		});
	}

	async findByHashedToken(hashedToken: string) {
		// const cacheResult = await this.cacheServer.getTokenInfo(hashedToken);

		// if (cacheResult) {
		// 	return cacheResult;
		// }
		const result = await this.userToken.findOne({ hashedToken });

		if (!result) {
			return null;
		}
		// await this.cacheServer.setTokenInfo(result);
		return {
			userId: result.userId
		};
	}

	async findOne(option?: { userId?: string, hashedToken?: string }) {
		const { userId, hashedToken } = option;

		return await this.userToken.findOne({
			...userId ? { userId } : {},
			...hashedToken ? { hashedToken } : {}
		});
	}
}

export const UserTokenDalProvider = {
	provide: 'USER_TOKEN_DAL',
	useClass: UserTokenDal
};
