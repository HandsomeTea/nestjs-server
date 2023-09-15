import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { log } from '@/configs';
import { typeIs } from '@coco-sheng/js-tools';

/**
 * 字段中间件可以用在
 * 		graphql的model定义文件里
 * 		全局module的buildSchemaOptions.fieldMiddleware中
 * 		自定义字段的resolver(@ResolveField)
 * ，dto中无法使用字段中间件，字段中间件运行于数据转换之前，在这之前可以在中间件中做任何事情
 * 字段的最终显示处理放在Directive较好，因为Directive是数据返回前最后一个调用
 */

export const graphqlFieldDeal: FieldMiddleware = async (
	ctx: MiddlewareContext,
	next: NextFn,
) => {
	const value = await next();
	const { key, typename } = ctx.info.path;
	// const data = ctx.source;

	log('graphql-field-middleware').debug({ [`${typename}.${key}`]: value, type: typeIs(value) });
	return value;
};
