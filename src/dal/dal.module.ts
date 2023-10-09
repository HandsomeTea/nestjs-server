import { DbModule } from '@/db/db.module';
import { Module } from '@nestjs/common';
import { UserDalProvider } from './user.dal';
import { UserTokenDalProvider } from './user-token.dal';
import { RoleDalProvider } from './role.dal';
// import { PrismaTestDalProvider } from './prisma.test.dal';
// import { CacheModule } from './cache/cache.module';

@Module({
	imports: [
		DbModule
		// CacheModule
	],
	providers: [UserDalProvider, UserTokenDalProvider, RoleDalProvider/*, PrismaTestDalProvider*/],
	exports: [UserDalProvider, UserTokenDalProvider, RoleDalProvider/*, PrismaTestDalProvider*/]
})
export class DalModule { }
