import { Module } from '@nestjs/common';
import { dbConnectProvider, UsersProvider } from './db.providers';

@Module({
	providers: [dbConnectProvider, UsersProvider],
	exports: [dbConnectProvider, UsersProvider]
})
export class DbModule {}
