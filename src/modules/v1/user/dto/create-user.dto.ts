import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {

	@IsNotEmpty({ message: 'create用户名不能为空' })
	@IsString({ message: 'create用户名必须为字符串' })
	readonly name?: string;

	readonly phone?: string;

	readonly email?: string;

	readonly password?: string;

	readonly avatar?: string;

	readonly type?: Array<UserType>;

	readonly status?: UserStatus;
}
