import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { V1AppModule } from './v1';

@Module({
	imports: [
		// 环境变量配置
		ConfigModule.forRoot({
			envFilePath: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? ['.env.local'] : []
		}),
		// 健康检查模块
		HealthModule,
		V1AppModule
	]
})
export class MasterModule { }
