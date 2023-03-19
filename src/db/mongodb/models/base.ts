import {
	IndexDefinition,
	IndexOptions,
	Model,
	Schema,
	FilterQuery,
	QueryOptions,
	UpdateQuery,
	UpdateWithAggregationPipeline
} from 'mongoose';
import { ObjectId } from 'bson';
import * as mongoose from 'mongoose';
import { MongoHas } from '../../db.interfaces';

export default class MongoBase<CM> {
	protected collectionName: string;
	private schema: Schema<CM>;
	private index: Array<{ fields: IndexDefinition; options?: IndexOptions }> | undefined;

	constructor(
		collectionName: string,
		schema: Schema<CM>,
		index?: Array<{ fields: IndexDefinition; options?: IndexOptions }>
	) {
		this.collectionName = collectionName;
		this.schema = schema;
		this.index = index;
	}

	private get model(): Model<CM> {
		this.schema.set('timestamps', {
			createdAt: true,
			updatedAt: true
		});
		this.schema.set('versionKey', false);

		if (this.index) {
			for (let s = 0; s < this.index.length; s++) {
				this.schema.index(this.index[s].fields, this.index[s].options);
			}
		}
		return mongoose.connection.model<CM>(this.collectionName, this.schema, this.collectionName);
	}

	async insertOne(data: CM): Promise<CM & MongoHas> {
		return (await new this.model(data).save()).toObject();
	}

	async insertMany(data: Array<CM>): Promise<Array<CM & MongoHas>> {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return await this.model.insertMany(data, { lean: true });
	}

	async deleteOne(query: FilterQuery<CM>, options?: QueryOptions<CM>): Promise<{ acknowledged: boolean; deletedCount: number }> {
		return await this.model.deleteOne(query, options);
	}

	// async removeMany(query: FilterQuery<CM>): Promise<{ deletedCount: number }> {
	// 	if (await this.collectionExist()) {
	// 		return await this.model.deleteMany(query);
	// 	}
	// 	return { deletedCount: 0 };
	// }

	async updateOne(
		query: FilterQuery<CM>,
		update: UpdateQuery<CM> | UpdateWithAggregationPipeline,
		options?: QueryOptions<CM>
	): Promise<{
		acknowledged: boolean;
		modifiedCount: number;
		upsertedId: null | ObjectId;
		upsertedCount: number;
		matchedCount: number;
	}> {
		return await this.model.updateOne(query, update, options);
	}

	// async updateMany(query: FilterQuery<CM>, update: UpdateQuery<CM> | UpdateWithAggregationPipeline, options?: QueryOptions<CM>): Promise<{
	// 	acknowledged: boolean
	// 	modifiedCount: number
	// 	upsertedId: null | string
	// 	upsertedCount: number
	// 	matchedCount: number
	// }> {
	// 	if (await this.collectionExist()) {
	// 		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// 		// @ts-ignore
	// 		return await this.model.updateMany(query, update, options);
	// 	}
	// 	return {
	// 		acknowledged: false,
	// 		modifiedCount: 0,
	// 		upsertedId: null,
	// 		upsertedCount: 0,
	// 		matchedCount: 0
	// 	};
	// }

	async find(query?: FilterQuery<CM>, options?: QueryOptions<CM>): Promise<Array<CM & MongoHas>> {
		return await this.model.find(query || {}, null, options).lean();
	}

	// async findOne(query: FilterQuery<CM>, options?: QueryOptions<CM>) {
	// 	if (await this.collectionExist()) {
	// 		return await this.model.findOne(query, null, options).lean();
	// 	}
	// 	return null;
	// }

	async findById(_id: string, options?: QueryOptions<CM>): Promise<null | (CM & MongoHas)> {
		return await this.model.findById(_id, options).lean();
	}

	// async paging<K extends keyof CM>(query: FilterQuery<CM>, limit: number, skip: number, sort?: Record<K, 'asc' | 'desc' | 'ascending' | 'descending'>, options?: QueryOptions<CM>) {
	// 	if (await this.collectionExist()) {
	// 		return {
	// 			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// 			// @ts-ignore
	// 			list: await this.model.find(query, null, options).sort((() => {
	// 				const obj: { [key: string]: SortOrder } = {};

	// 				if (sort) {
	// 					Object.keys(sort).filter(a => !!sort[a]).map(b => obj[b] = sort[b]);
	// 				}
	// 				return obj;
	// 			})()).skip(skip || 0).limit(limit).lean(),
	// 			total: await this.count(query)
	// 		};
	// 	}
	// 	return {
	// 		list: [],
	// 		total: 0
	// 	};
	// }

	// async count(query?: FilterQuery<CM>): Promise<number> {
	// 	if (!await this.collectionExist()) {
	// 		return 0;
	// 	}
	// 	if (Object.keys(query || {}).length > 0) {
	// 		return await this.model.countDocuments(query || {});
	// 	} else {
	// 		return await this.model.estimatedDocumentCount();
	// 	}
	// }

	// // get aggregate() {
	// //     return this.model.aggregate;
	// // }

	// // eslint-disable-next-line @typescript-eslint/no-explicit-any
	// async aggregate(aggregations: Array<any>): Promise<Aggregate<Array<any>>> {
	// 	if (!await this.collectionExist()) {
	// 		return [];
	// 	}
	// 	return await this.model.aggregate(aggregations);
	// }
}
