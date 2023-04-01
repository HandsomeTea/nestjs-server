import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { log } from '@/configs';
import { typeIs } from '@/utils';

export const graphqlFieldDeal: FieldMiddleware = async (
	ctx: MiddlewareContext,
	next: NextFn,
) => {
	const value = await next();
	const { key, typename } = ctx.info.path;
	// const data = ctx.source;

	log('graphql-response-field').debug({ [`${typename}.${key}`]: value, type: typeIs(value) });
	return value;
};
