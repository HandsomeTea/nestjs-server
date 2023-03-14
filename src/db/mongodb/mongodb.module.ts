import { Module } from '@nestjs/common';
import { dbConnectProvider } from './providers/connection.providers';
import { UsersProvider } from './providers/user.providers';

@Module({
	providers: [dbConnectProvider, UsersProvider],
	exports: [dbConnectProvider, UsersProvider]
})
export class MongodbModule { }
