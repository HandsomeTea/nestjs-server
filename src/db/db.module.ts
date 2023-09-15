/**
 * 切换数据库
 * 只需切换db.module和db.providers中模块的输出指向
 */
import { Module } from '@nestjs/common';
import { dbConnectProvider, UserProvider, UserTokenProvider, RoleProvider } from './db.providers';

@Module({
	providers: [dbConnectProvider, UserProvider, UserTokenProvider, RoleProvider],
	exports: [dbConnectProvider, UserProvider, UserTokenProvider, RoleProvider]
})
export class DbModule { }
