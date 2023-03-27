import { Module } from '@nestjs/common';
import { DateScalar } from './common/scalars/date.scalar';
import { RecipesResolver } from './recipes.resolver';
import { RecipesService } from './recipes.service';

import { GraphQLModule } from '@nestjs/graphql';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { upperDirectiveTransformer } from './common/directives/upper-case.directive';

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
