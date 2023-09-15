import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController, AccountPubController } from './user.controller';
import { DalModule } from '@/dal';
import { HttpModule } from '@/providers/HTTP';

@Module({
	imports: [DalModule, HttpModule],
	controllers: [UserController, AccountPubController],
	providers: [UserService, DalModule]
})
export class UserModule { }
