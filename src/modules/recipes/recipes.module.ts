import { Module } from '@nestjs/common';
import { DateScalar } from './common/scalars/date.scalar';
import { RecipesResolver } from './recipes.resolver';
import { RecipesService } from './recipes.service';

import { GraphQLModule } from '@nestjs/graphql';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { upperDirectiveTransformer } from './common/directives/upper-case.directive';

/**
 * graphql数据后置处理的顺序
 * http的response转换器(后置拦截器)--->graphql的字段中间件--->Apollo的Directive：自定义的transformSchema
 * 从resolver返回数据开始，后续的字段中间件、Directive对数据的操作都不影响实际的数据，只影响返回的数据
 */

@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: true,
			transformSchema: schema => upperDirectiveTransformer(schema, 'upper'),
			installSubscriptionHandlers: true, // 开启subscription功能
			buildSchemaOptions: {
				directives: [
					new GraphQLDirective({
						name: 'upper',
						locations: [DirectiveLocation.FIELD_DEFINITION]
					})
				]
			}
		})
	],
	providers: [RecipesResolver, RecipesService, DateScalar]
})
export class RecipesModule { }
