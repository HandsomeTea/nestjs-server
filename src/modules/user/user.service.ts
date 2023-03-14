import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { /*HttpError, Exception,*/ log } from '@/configs';
import { UserModel } from '@/db/mongodb/interfaces';

@Injectable()
export class UserService {
	constructor(
		@Inject('USER_MODEL') private UserModel: Model<UserModel>
	) { }

	async create(createUserDto: CreateUserDto) {
		log().debug(createUserDto);
		const result = await this.UserModel.create(createUserDto);

		// return process.env.PORT;
		// throw new Exception('cuo le', HttpError.BE_LOGOUT);
		// throw new Exception('cuo le', HttpStatus.BAD_GATEWAY, ['213123221']);
		return result._id.toString();
	}

	findAll() {
		return [];
	}

	findOne(id: number) {
		return `This action returns a #${id} user`;
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		log().debug(updateUserDto);
		return `This action updates a #${id} user`;
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
