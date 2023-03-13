import { Module } from '@nestjs/common';
import { UserController, UserService } from './user';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [ConfigModule.forRoot({
		isGlobal: true,
		ignoreEnvFile: !(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'),
		envFilePath: ['.env.local']
	})],
	controllers: [UserController],
	providers: [UserService]
})
export class V1AppModule { }
