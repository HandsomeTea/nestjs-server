import { ApolloServerPlugin, GraphQLRequestContext } from '@apollo/server';
import { Plugin } from '@nestjs/apollo';
import { log } from '@/configs';

type DT = Record<string, unknown>;

@Plugin()
export class CatchPluginError implements ApolloServerPlugin<DT>{
	// 捕获插件中的错误
	async unexpectedErrorProcessingRequest?({ requestContext, error }: { requestContext: GraphQLRequestContext<DT>, error: Error }): Promise<void> {
		log('apollo-unexpected-error').error(`error[${error.message}] from ${requestContext.request.query}`);
	}
}
