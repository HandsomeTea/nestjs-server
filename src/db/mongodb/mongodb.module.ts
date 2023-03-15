import { Module } from '@nestjs/common';
import { dbConnectProvider, UsersProvider } from './mongodb.providers';

@Module({
	providers: [dbConnectProvider, UsersProvider],
	exports: [dbConnectProvider, UsersProvider]
})
export class MongodbModule { }
