import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@IsString({ message: '用户名必须为字符串' })
	readonly name?: string;
}
