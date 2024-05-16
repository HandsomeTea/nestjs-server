import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedis } from '@svtslv/nestjs-ioredis';
import { CacheServer } from './cache.interfaces';

@Injectable()
export class CacheService implements CacheServer {
	// 也可以注入别的缓存服务
	constructor(@InjectRedis() private server: Redis) { }

	private cacheUserKey(userId: string): string {
		return `user:id_${userId}`;
	}

	async setUserById(user: UserModel): Promise<void> {
		await this.server.set(this.cacheUserKey(user._id.toString()), JSON.stringify(user), 'EX', Math.floor(Math.random() * 11 + 50) * 60); //秒为单位
	}

	async getUserById(userId: string): Promise<UserModel> {
		const result = await this.server.get(this.cacheUserKey(userId));

		return JSON.parse(result) as UserModel;
	}

	async deleteUserById(userId: string | Array<string>): Promise<void> {
		if (Array.isArray(userId) && userId.length > 0) {
			for (let s = 0; s < userId.length; s++) {
				await this.server.del(this.cacheUserKey(userId[s]));
			}
		}
		if (typeof userId === 'string') {
			await this.server.del(this.cacheUserKey(userId));
		}
	}
}
