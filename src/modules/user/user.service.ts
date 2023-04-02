import { Inject, Injectable/*, HttpStatus*/ } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { ErrorCode, Exception } from '@/configs';
import { UserDal } from '@/dal';

@Injectable()
export class UserService {
	constructor(@Inject('USER_DAL') private user: UserDal) { }

	async create(user: CreateUserDto) {
		return await this.user.insertOne(user);
	}

	async findAll() {
		// return process.env.PORT;
		// throw new Exception('cuo le', ErrorCode.BE_LOGOUT);
		// throw new Exception('cuo le', HttpStatus.BAD_GATEWAY, { userid: '213123221' });
		return await this.user.find();
	}

	async findOne(id: string) {
		return await this.user.findById(id);
	}

	async update(id: string, updateUser: UpdateUserDto) {
		return await this.user.updateOne(id, updateUser);
	}

	async remove(id: string) {
		return await this.user.deleteOne(id);
	}
}
