import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { /*HttpError, Exception,*/ log } from '@/configs';

@Injectable()
export class UserService {
	constructor(private configService: ConfigService) { }

	create(createUserDto: CreateUserDto) {
		log().debug(createUserDto);
		return {};
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

	getHello(): string {
		// return this.configService.get('NODE_ENV');
		// return process.env.PORT;
		// throw new Exception('cuo le', HttpError.BE_LOGOUT);
		// throw new Exception('cuo le', HttpStatus.BAD_GATEWAY, ['213123221']);
		return 'Hello World!';
	}
}
