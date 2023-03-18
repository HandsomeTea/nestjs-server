import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DbModule } from '@/db/db.module';
import { UserProvider } from '@/db/db.providers';

@Module({
	imports: [DbModule],
	controllers: [UserController],
	providers: [UserService, UserProvider]
})
export class UserModule { }
