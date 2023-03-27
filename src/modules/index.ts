import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { RecipesModule } from './recipes/recipes.module';

@Module({
	imports: [
		// 环境变量配置
		ConfigModule.forRoot({
			envFilePath: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? ['.env.local'] : []
		}),
		// 健康检查模块
		HealthModule,
		// rest api示例模块
		UserModule,
		// graphql示例模块
		RecipesModule
	]
})
export class V1AppModule { }
