import {
	IndexDefinition,
	IndexOptions,
	Model,
	Schema,
	FilterQuery,
	QueryOptions,
	UpdateQuery,
	UpdateWithAggregationPipeline,
	SortOrder,
	Types
} from 'mongoose';
import { ObjectId } from 'bson';
import * as mongoose from 'mongoose';

type Mongo<T> = T & { _id: Types.ObjectId, createdAt: Date, updatedAt: Date }

export default abstract class MongoBase<CM> {
	protected collectionName: string;
	private schema: Schema<Omit<CM, '_id' | 'createdAt' | 'updatedAt'>>;
	private index: Array<{ fields: IndexDefinition; options?: IndexOptions }> | undefined;

	protected constructor(
		collectionName: string,
		schema: Schema<Omit<CM, '_id' | 'createdAt' | 'updatedAt'>>,
		index?: Array<{ fields: IndexDefinition; options?: IndexOptions }>
	) {
		this.collectionName = collectionName;
		this.schema = schema;
		this.index = index;
	}

	private get model(): Model<Omit<CM, '_id' | 'createdAt' | 'updatedAt'>> {
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
		return mongoose.connection.model<Omit<CM, '_id' | 'createdAt' | 'updatedAt'>>(this.collectionName, this.schema, this.collectionName);
	}

	async insertOne(data: Omit<CM, '_id' | 'createdAt' | 'updatedAt'>): Promise<Mongo<CM>> {
		return await new this.model(data).save() as unknown as Mongo<CM>;
	}

	async insertMany(data: Array<Omit<CM, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Array<Mongo<CM>>> {
		return await this.model.insertMany(data, { lean: true }) as unknown as Array<Mongo<CM>>;
	}

	async deleteOne(query: FilterQuery<Mongo<CM>>, options?: QueryOptions<Mongo<CM>>): Promise<{ acknowledged: boolean; deletedCount: number }> {
		return await this.model.deleteOne(query, options).lean();
	}

	async deleteMany(query: FilterQuery<Mongo<CM>>): Promise<{ deletedCount: number }> {
		return await this.model.deleteMany(query).lean();
	}

	async updateOne(
		query: FilterQuery<Mongo<CM>>,
		update: UpdateQuery<Mongo<CM>> | UpdateWithAggregationPipeline,
		options?: QueryOptions<Mongo<CM>>
	): Promise<{
		acknowledged: boolean;
		modifiedCount: number;
		upsertedId: null | ObjectId;
		upsertedCount: number;
		matchedCount: number;
	}> {
		return await this.model.updateOne(query, update, options).lean();
	}

	async updateMany(query: FilterQuery<Mongo<CM>>, update: UpdateQuery<Mongo<CM>> | UpdateWithAggregationPipeline, options?: QueryOptions<Mongo<CM>>): Promise<{
		acknowledged: boolean
		modifiedCount: number
		upsertedId: null | ObjectId
		upsertedCount: number
		matchedCount: number
	}> {
		return await this.model.updateMany(query, update, options).lean();
	}

	async find(query?: FilterQuery<Mongo<CM>>, options?: QueryOptions<Mongo<CM>>): Promise<Array<Mongo<CM>>> {
		return await this.model.find(query || {}, null, options).lean();
	}

	async findOne(query: FilterQuery<Mongo<CM>>, options?: QueryOptions<Mongo<CM>>) {
		return await this.model.findOne(query, null, options).lean();
	}

	async findById(_id: string, options?: QueryOptions<Mongo<CM>>): Promise<null | Mongo<CM>> {
		return await this.model.findById(_id, null, options).lean();
	}

	async findOneAndUpdate(query: FilterQuery<Mongo<CM>>, update: UpdateQuery<Mongo<CM>>, options?: QueryOptions<Mongo<CM>>) {
		return await this.model.findOneAndUpdate(query, update, { ...options || {}, new: true }).lean();
	}

	async paging<K extends keyof CM>(query: FilterQuery<Mongo<CM>>, limit: number, skip: number, sort?: Record<K, 'asc' | 'desc' | 'ascending' | 'descending'>, options?: QueryOptions<Mongo<CM>>) {
		return {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			list: await this.model.find(query, null, options).sort((() => {
				const obj: { [key: string]: SortOrder } = {};

				if (sort) {
					Object.keys(sort).filter(a => !!sort[a]).map(b => obj[b] = sort[b]);
				}
				return obj;
			})()).skip(skip || 0).limit(limit).lean() as Mongo<CM>,
			total: await this.count(query)
		};
	}

	async count(query?: FilterQuery<Mongo<CM>>): Promise<number> {
		if (Object.keys(query || {}).length > 0) {
			return await this.model.countDocuments(query || {});
		} else {
			return await this.model.estimatedDocumentCount();
		}
	}

	// get aggregate() {
	//     return this.model.aggregate;
	// }

	// // eslint-disable-next-line @typescript-eslint/no-explicit-any
	// async aggregate(aggregations: Array<any>): Promise<Aggregate<Array<any>>> {
	// 	if (!await this.collectionExist()) {
	// 		return [];
	// 	}
	// 	return await this.model.aggregate(aggregations);
	// }
}
