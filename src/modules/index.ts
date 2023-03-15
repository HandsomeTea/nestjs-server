import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongodbModule } from '../db/mongodb/mongodb.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		MongodbModule,
		HealthModule,
		UserModule,
		ConfigModule.forRoot({
			ignoreEnvFile: process.env.NODE_ENV === 'production',
			envFilePath: ['.env.local']
		})
	]
})
export class V1AppModule { }
