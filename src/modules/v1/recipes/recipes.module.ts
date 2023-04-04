import { Module } from '@nestjs/common';
import { DateScalar } from './common/scalars/date.scalar';
import { RecipesResolver } from './recipes.resolver';
import { RecipesService } from './recipes.service';

import { GraphQLModule } from '@nestjs/graphql';
import { DirectiveLocation, GraphQLDirective, GraphQLError, GraphQLFormattedError } from 'graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { upperDirectiveTransformer } from './common/directives/upper-case.directive';
import { TraceLoggingPlugin, ComplexityPlugin } from './common/plugins';
import { log, system } from '@/configs';

/**
 * graphql数据后置处理的顺序
 * http的response转换器(后置拦截器)--->graphql的字段中间件--->Apollo的Directive：自定义的transformSchema
 * 从resolver返回数据开始，后续的字段中间件、Directive对数据的操作都不影响实际的数据，只影响返回的数据
 */

@Module({
	imports: [
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			driver: ApolloDriver,
			useFactory: () => {
				return {
					logger: system('apollo'),
					path: process.env.GQL_Path,
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
					},
					formatError: (formattedError: GraphQLFormattedError, error: GraphQLError): GraphQLFormattedError => {
						log('apollo-unexpected-error').error(`${error.path.join(',')}: ${error.message} \n${JSON.stringify(formattedError, null, '   ')}`);
						return error;
					}
				};
			}
		})
	],
	providers: [RecipesResolver, RecipesService, DateScalar, TraceLoggingPlugin, ComplexityPlugin]
})
export class RecipesModule { }
