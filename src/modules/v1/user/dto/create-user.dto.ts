import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
	@IsString({ message: '用户名必须为字符串' })
	@IsNotEmpty({ message: '用户名不能为空' })
	readonly name: string;
}
