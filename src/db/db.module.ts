/**
 * 切换数据库
 * 只需切换providers中模块的输出指向
 */
import { Module } from '@nestjs/common';
import { dbConnectProvider, UserProvider, UserTokenProvider, RoleProvider } from './mongoose/mongoose.providers';
// import { dbConnectProvider, UserProvider } from './sequelize/sequelize.providers';
// import { dbConnectProvider } from './prisma/prisma.providers';

@Module({
	providers: [dbConnectProvider, UserProvider, UserTokenProvider, RoleProvider],
	exports: [dbConnectProvider, UserProvider, UserTokenProvider, RoleProvider]
})
export class DbModule { }
