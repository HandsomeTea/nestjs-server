import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongodbModule } from '@/db/mongodb/mongodb.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? ['.env.local'] : []
		}),
		MongodbModule,
		HealthModule,
		UserModule
	]
})
export class V1AppModule { }
