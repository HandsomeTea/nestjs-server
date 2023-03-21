import { Inject, Injectable } from '@nestjs/common';
import { InjectRedisClient } from 'nestjs-ioredis';
import Redis from 'ioredis';
import { User } from '@/db/db.models';
import { KeysOf, UserModel } from '@/db/db.interfaces';

@Injectable()
export class UserDal {
	constructor(
		@InjectRedisClient('test') private redis: Redis,
		@Inject('USER_MODEL') private user: User
	) { }

	private catchKey(userId: string): string {
		return `user:id_${userId}`;
	}

	async insertOne(data: UserModel) {
		return await this.user.insertOne(data);
	}

	async find() {
		return await this.user.find();
	}

	async findById(id: string) {
		const redisResult = await this.redis.get(this.catchKey(id));

		if (redisResult) {
			return JSON.parse(redisResult) as UserModel;
		}
		const result = await this.user.findById(id);

		if (!result) {
			return null;
		}
		await this.redis.set(this.catchKey(id), JSON.stringify(result), 'EX', Math.floor(Math.random() * 11 + 50) * 60); //秒为单位
		return result;
	}

	async updateOne(id: string, updateUser: KeysOf<UserModel>) {
		return await this.user.updateOne({ _id: id }, { $set: updateUser });
	}

	async deleteOne(id: string) {
		return await this.user.deleteOne({ _id: id });
	}
}

export const UserDalProvider = {
	provide: 'USER_DAL',
	useClass: UserDal
};
