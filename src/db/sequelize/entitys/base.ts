import { BulkCreateOptions, CountOptions, CreateOptions, CreationAttributes, DestroyOptions, FindAndCountOptions, FindOptions, Identifier, QueryTypes, UpdateOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';

type Sql<T> = T & { createdAt: Date, updatedAt: Date }

export default class SequelizeBase<TM> extends Model<TM> {
	private modelName: string;

	protected constructor(...args) {
		super(...args);
		this.modelName = args[0];
	}

	private get model() {
		return this.sequelize.model(this.modelName);
	}

	public async insertOne(data: CreationAttributes<Model<TM>>, option?: CreateOptions<TM>): Promise<Sql<TM>> {
		return (await this.model.create(data, option)).get();
	}

	public async insertMany(data: Array<CreationAttributes<Model<TM>>>, option?: BulkCreateOptions<TM>): Promise<Array<Sql<TM>>> {
		return (await this.model.bulkCreate(data, option)).map(a => a.get());
	}

	public async delete(option: DestroyOptions<Sql<TM>>): Promise<number> {
		return await this.model.destroy(option);
	}

	public async updateMany(query: UpdateOptions<Sql<TM>>, set: { [key in keyof Sql<TM>]?: Sql<TM>[key] }): Promise<number> {
		return (await this.model.update(set, query))[0];
	}

	public async find(query?: FindOptions<Sql<TM>>): Promise<Array<Sql<TM>>> {
		return (await this.model.findAll(query)).map(a => a.get());
	}

	public async findOne(query?: FindOptions<Sql<TM>>): Promise<Sql<TM>> {
		return (await this.model.findOne(query || {})).get();
	}

	public async findById(id: Identifier, option?: Omit<FindOptions<Sql<TM>>, 'where'>): Promise<null | Sql<TM>> {
		return (await this.model.findByPk(id, option))?.get();
	}

	public async paging(query: Omit<FindAndCountOptions<Sql<TM>>, 'group'>) {
		const pageResult = await this.model.findAndCountAll(query);

		return { list: (pageResult?.rows.map(a => a.get()) || []) as unknown as Array<Sql<TM>>, total: pageResult?.count || 0 };
	}

	public async count(query?: Omit<CountOptions<Sql<TM>>, 'group'>): Promise<number> {
		return await this.model.count(query) || 0;
	}

	/**
	 * @param {string} sql 如: insert into test (id, user_id, type, create_at, updated_at) values ('test123', 'aaaaaa', 'ws', '2022-4-13 21:10:12', '2022-4-13 21:10:12');
	 * @returns {Promise<[number, number]>}
	 * @memberof SequelizeBase
	 */
	public async insertExecute(sql: string): Promise<[number, number]> {
		return await this.sequelize.query(sql, { type: QueryTypes.INSERT });
	}

	/**
	 * @param {string} sql 如: delete from test where type='ws';
	 * @returns {Promise<undefined>}
	 * @memberof SequelizeBase
	 */
	public async deleteExecute(sql: string): Promise<void> {
		return await this.sequelize.query(sql, { type: QueryTypes.DELETE });
	}

	/**
	 * 注意: where条件必须在set条件之后
	 * @param {string} sql 如: update test set user_id='asdasdasd1234' where id='sad23asd345dfg';
	 * @returns {Promise<[null, number]>}
	 * @memberof SequelizeBase
	 */
	public async updateExecute(sql: string): Promise<[null, number]> {
		return await this.sequelize.query(sql, { type: QueryTypes.UPDATE });
	}

	// /**
	//  * update的是: duplicate key 后面的数据
	//  * @param {string} sql 如: insert into test (id, user_id, type, create_at, updated_at) values ('test12345ss', 'sssaa', 'ws', '2022-4-13 21:10:12', '2022-4-13 21:10:12') on duplicate key update id='test12345ss1', user_id='sssaa1';
	//  * @returns {Promise<[number, boolean]>} [0, true]代表insert，[0, false]代表update
	//  * @memberof SequelizeBase
	//  */
	// public async upsertExecute(sql: string): Promise<[number, boolean]> {
	//     return await this.sequelize.query(sql, { type: QueryTypes.UPSERT }) as unknown as [number, boolean];
	// }

	/**
	 * @param {string} sql 如: select * from test;
	 * @returns {Promise<Array<Sql<TM>>>}
	 * @memberof SequelizeBase
	 */
	public async selectExecute(sql: string): Promise<Array<Sql<TM>>> {
		return await this.sequelize.query(sql, { type: QueryTypes.SELECT });
	}
}
