import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {

	constructor() {
		super();
	}

	@IsString({ message: 'update name must be a string' })
	readonly name?: string;

	readonly email?: string;

	readonly phone?: string;

	readonly password?: string;

	readonly avatar?: string;

	readonly type?: Array<UserType>;

	readonly status?: UserStatus;
}
