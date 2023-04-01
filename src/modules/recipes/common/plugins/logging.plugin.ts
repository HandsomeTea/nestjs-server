import { ApolloServerPlugin, GraphQLRequestListener, GraphQLRequestContext, GraphQLRequestContextWillSendResponse } from '@apollo/server';
import { Plugin } from '@nestjs/apollo';
import * as httpContext from 'express-http-context';
import { trace } from '@/configs';

type DT = Record<string, unknown>;

@Plugin()
export class TraceLoggingPlugin implements ApolloServerPlugin<DT> {
	async requestDidStart(requestContext: GraphQLRequestContext<DT>): Promise<GraphQLRequestListener<DT> | void> {
		trace(
			{
				traceId: httpContext.get('traceId'),
				spanId: httpContext.get('spanId'),
				parentSpanId: httpContext.get('parentSpanId')
			},
			'apollo-request'
		).info(requestContext.request.query);
		return {
			async willSendResponse(reqContext: GraphQLRequestContextWillSendResponse<DT>) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				// const orgData = (reqContext.response.body.singleResult || reqContext.response.body.subsequentResults || reqContext.response.body.initialResult).data;
				// const key = Object.getOwnPropertyNames(orgData)[0];
				// const data = Object.getOwnPropertyDescriptors(orgData[key]);
				// const obj = {
				// 	[`${key}`]: {}
				// };

				// for (const k in data) {
				// 	obj[`${key}`][`${k}`] = data[k].value;
				// }
				trace(
					{
						traceId: httpContext.get('traceId'),
						spanId: httpContext.get('spanId'),
						parentSpanId: httpContext.get('parentSpanId')
					},
					'apollo-response'
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
				).info((reqContext.response.body.singleResult || reqContext.response.body.subsequentResults || reqContext.response.body.initialResult).data);
			}
		};
	}
}
