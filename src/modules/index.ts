import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		HealthModule,
		UserModule,
		ConfigModule.forRoot({
			ignoreEnvFile: !(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'),
			envFilePath: ['.env.local']
		})
	]
})
export class V1AppModule {}
