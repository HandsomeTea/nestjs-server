import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { HttpError, Exception } from '@/configs';
import { UserModel } from '@/db/mongodb/interfaces';

@Injectable()
export class UserService {
	constructor(
		@Inject('USER_MODEL') private UserModel: Model<UserModel>
	) { }

	async create(user: CreateUserDto) {
		const result = await this.UserModel.create(user);

		return result._id.toString();
	}

	async findAll() {
		// return process.env.PORT;
		// throw new Exception('cuo le', HttpError.BE_LOGOUT);
		// throw new Exception('cuo le', HttpStatus.BAD_GATEWAY, ['213123221']);
		return await this.UserModel.find();
	}

	async findOne(id: string) {
		return await this.UserModel.findById(id);
	}

	async update(id: string, updateUser: UpdateUserDto) {
		return (await this.UserModel.updateOne({ _id: id }, { $set: updateUser })).modifiedCount === 1;
	}

	async remove(id: string) {
		return await this.UserModel.deleteOne({ _id: id });
	}
}
