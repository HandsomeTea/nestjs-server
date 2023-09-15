import { DbModule } from '@/db/db.module';
import { Module } from '@nestjs/common';
import { UserDalProvider } from './user.dal';
import { UserTokenDalProvider } from './user-token.dal';
import { CacheModule } from './cache/cache.module';

@Module({
	imports: [
		DbModule,
		CacheModule
	],
	providers: [UserDalProvider, UserTokenDalProvider],
	exports: [UserDalProvider, UserTokenDalProvider]
})
export class DalModule { }
