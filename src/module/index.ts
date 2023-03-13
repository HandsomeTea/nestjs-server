import { Module } from '@nestjs/common';
import { UserController, UserService } from './user';

@Module({
	imports: [],
	controllers: [UserController],
	providers: [UserService]
})
export class V1AppModule { }
