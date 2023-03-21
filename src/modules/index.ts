import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		// 环境变量配置
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? ['.env.local'] : []
		}),
		// 健康检查模块
		HealthModule,
		// 用户模块
		UserModule
	]
})
export class V1AppModule { }
