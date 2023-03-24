import { Inject, Injectable } from '@nestjs/common';
import { User } from '@/db/db.models';
import { KeysOf, UserModel } from '@/db/db.interfaces';
import { CacheServer } from './cache/cache.interfaces';

@Injectable()
export class UserDal {
	constructor(
		@Inject('CACHE_MODEL') private cacheServer: CacheServer,
		@Inject('USER_MODEL') private user: User
	) { }

	async insertOne(data: UserModel) {
		return await this.user.insertOne(data);
	}

	async find() {
		return await this.user.find();
	}

	async findById(id: string) {
		const cacheResult = await this.cacheServer.getUserById(id);

		if (cacheResult) {
			return cacheResult;
		}
		const result = await this.user.findById(id);

		if (!result) {
			return null;
		}
		await this.cacheServer.setUserById(result);
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
