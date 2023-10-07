import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
	readonly name?: string;

	@IsNotEmpty({ message: '手机号不能为空' })
	readonly phone: string;

	readonly email?: string;

	readonly password?: string;

	readonly role?: Array<string>;

	readonly avatar?: string;

	readonly type?: Array<UserType>;

	readonly status?: UserStatus;
}
