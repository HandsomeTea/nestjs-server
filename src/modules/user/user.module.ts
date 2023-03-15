import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DbModule } from '@/db/db.module';
import { UsersProvider } from '@/db/db.providers';

@Module({
	imports: [DbModule],
	controllers: [UserController],
	providers: [UserService, UsersProvider]
})
export class UserModule {}
