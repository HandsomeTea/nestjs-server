import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		UserModule,
		ConfigModule.forRoot({
			ignoreEnvFile: !(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'),
			envFilePath: ['.env.local']
		})
	]
})
export class V1AppModule { }
