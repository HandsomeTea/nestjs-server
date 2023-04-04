import { log } from '@/configs';
import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import { Plugin } from '@nestjs/apollo';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import {
	fieldExtensionsEstimator,
	getComplexity,
	simpleEstimator
} from 'graphql-query-complexity';

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
	constructor(private gqlSchemaHost: GraphQLSchemaHost) { }

	async requestDidStart(): Promise<GraphQLRequestListener<unknown>> {
		const { schema } = this.gqlSchemaHost;

		return {
			async didResolveOperation({ request, document }) {
				const complexity = getComplexity({
					schema,
					operationName: request.operationName,
					query: document,
					variables: request.variables,
					estimators: [
						fieldExtensionsEstimator(),
						simpleEstimator({ defaultComplexity: 1 })
					]
				});

				if (complexity >= 20) {
					throw new GraphQLError(
						`Query is too complex: ${complexity}. Maximum allowed complexity: 20`,
					);
				}
				log('complexity-plugin').debug('Query Complexity:', complexity);
			}
		};
	}
}
