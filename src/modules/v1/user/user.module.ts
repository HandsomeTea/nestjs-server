import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController, AccountPubController, AccountController } from './user.controller';
import { DalModule } from '@/dal';
import { HttpModule } from '@/providers/HTTP';

@Module({
	imports: [DalModule, HttpModule],
	controllers: [UserController, AccountPubController, AccountController],
	providers: [UserService, DalModule]
})
export class UserModule { }
