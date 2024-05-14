import { Inject, Injectable } from '@nestjs/common';
import { UserTokens } from '@/db/db.models';

@Injectable()
export class UserTokenDal {
	constructor(
		@Inject('USER_TOKEN_MODEL') private userToken: UserTokens
	) { }

	private getModeledData(token: any): UserTokenModel {
		return {
			_id: token.id,
			userId: token.userId,
			hashedToken: token.hashedToken,
			createdAt: token.createdAt,
			updatedAt: token.updatedAt
		};
	}

	async insertOne(token: { userId: string, hashedToken: string }) {
		await this.userToken.create({ data: token });
	}

	async delete(query: { userId?: string }) {
		const { userId } = query;

		await this.userToken.deleteMany({
			where: { ...userId ? { userId } : {} }
		});
	}

	async findByHashedToken(hashedToken: string) {
		// const cacheResult = await this.cacheServer.getTokenInfo(hashedToken);

		// if (cacheResult) {
		// 	return cacheResult;
		// }
		const result = await this.userToken.findFirst({ where: { hashedToken } });

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
		const token = await this.userToken.findFirst({
			where: {
				...userId ? { userId } : {},
				...hashedToken ? { hashedToken } : {}
			}
		});

		if (!token) {
			return null;
		}

		return this.getModeledData(token);
	}
}

export const UserTokenDalProvider = {
	provide: 'USER_TOKEN_DAL',
	useClass: UserTokenDal
};
