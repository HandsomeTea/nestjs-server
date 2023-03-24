import { UserModel, MongoHas } from '@/db/db.interfaces';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedisClient } from 'nestjs-ioredis';
import { CacheServer } from './cache.interfaces';

@Injectable()
export class CacheService implements CacheServer {
	// 也可以注入别的缓存服务
	constructor(@InjectRedisClient('test') private server: Redis) { }

	private cacheUserKey(userId: string): string {
		return `user:id_${userId}`;
	}

	async setUserById(user: UserModel & MongoHas): Promise<void> {
		await this.server.set(this.cacheUserKey(user._id.toString()), JSON.stringify(user), 'EX', Math.floor(Math.random() * 11 + 50) * 60); //秒为单位
	}

	async getUserById(userId: string): Promise<UserModel> {
		const result = await this.server.get(this.cacheUserKey(userId));

		return JSON.parse(result) as UserModel;
	}
}
