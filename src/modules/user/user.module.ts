import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongodbModule } from '@/db/mongodb/mongodb.module';
import { UsersProvider } from '@/db/mongodb/mongodb.providers';

@Module({
	imports: [MongodbModule],
	controllers: [UserController],
	providers: [UserService, UsersProvider]
})
export class UserModule { }
