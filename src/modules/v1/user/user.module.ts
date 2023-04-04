import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DalModule } from '@/dal';

@Module({
	imports: [DalModule],
	controllers: [UserController],
	providers: [UserService, DalModule]
})
export class UserModule { }
