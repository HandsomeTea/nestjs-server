import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RecipesModule } from './recipes/recipes.module';
import { RoleModule } from './role/role.module';

@Module({
	imports: [
		// rest api示例模块
		UserModule,
		// graphql示例模块
		RecipesModule,
		// 其它
		RoleModule
	]
})
export class V1AppModule { }
