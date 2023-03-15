import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '@/db/db.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? ['.env.local'] : []
		}),
		DbModule,
		HealthModule,
		UserModule
	]
})
export class V1AppModule {}
