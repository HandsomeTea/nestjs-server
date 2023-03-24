import { DbModule } from '@/db/db.module';
import { Module } from '@nestjs/common';
import { UserDalProvider } from './user.dal';
import { CacheModule } from './cache/cache.module';

@Module({
	imports: [
		DbModule,
		CacheModule
	],
	providers: [UserDalProvider],
	exports: [UserDalProvider]
})
export class DalModule { }
