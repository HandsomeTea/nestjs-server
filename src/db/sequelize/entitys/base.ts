import { BulkCreateOptions, CountOptions, CreateOptions, CreationAttributes, DestroyOptions, FindAndCountOptions, FindOptions, Identifier, QueryTypes, UpdateOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';
import { SqlHas } from '../../db.interfaces';

export default class SequelizeBase<TM> extends Model<TM> {
	private modelName: string;

	constructor(...args) {
		super(...args);
		this.modelName = args[0];
	}

	private get model() {
		return this.sequelize.model(this.modelName);
	}

	public async insertOne(data: CreationAttributes<Model<TM>>, option?: CreateOptions<TM>): Promise<TM & SqlHas> {
		return (await this.model.create(data, option)).get();
	}

	public async insertMany(data: Array<CreationAttributes<Model<TM>>>, option?: BulkCreateOptions<TM>): Promise<Array<TM & SqlHas>> {
		return (await this.model.bulkCreate(data, option)).map(a => a.get());
	}

	public async delete(option: DestroyOptions<TM>): Promise<number> {
		return await this.model.destroy(option);
	}

	public async updateMany(query: UpdateOptions<TM>, set: { [key in keyof TM]?: TM[key] }): Promise<number> {
		return (await this.model.update(set, query))[0];
	}

	public async find(query?: FindOptions<TM>): Promise<Array<TM & SqlHas>> {
		return (await this.model.findAll(query)).map(a => a.get());
	}

	public async findOne(query?: FindOptions<TM>): Promise<TM & SqlHas> {
		return (await this.model.findOne(query || {})).get();
	}

	public async findById(id: Identifier, option?: Omit<FindOptions<TM>, 'where'>): Promise<null | TM & SqlHas> {
		return (await this.model.findByPk(id, option))?.get();
	}

	public async paging(query: Omit<FindAndCountOptions<TM>, 'group'>) {
		const pageResult = await this.model.findAndCountAll(query);

		return { list: (pageResult?.rows.map(a => a.get()) || []) as unknown as Array<TM & SqlHas>, total: pageResult?.count || 0 };
	}

	public async count(query?: Omit<CountOptions<TM>, 'group'>): Promise<number> {
		return await this.model.count(query) || 0;
	}

	/**
	 * @param {string} sql 如: insert into test (id, user_id, type, create_at, updated_at) values ('test123', 'aaaaaa', 'ws', '2022-4-13 21:10:12', '2022-4-13 21:10:12');
	 * @returns {Promise<[number, number]>}
	 * @memberof SqlBase
	 */
	public async insertExecute(sql: string): Promise<[number, number]> {
		return await this.sequelize.query(sql, { type: QueryTypes.INSERT });
	}

	/**
	 * @param {string} sql 如: delete from test where type='ws';
	 * @returns {Promise<undefined>}
	 * @memberof SqlBase
	 */
	public async deleteExecute(sql: string): Promise<void> {
		return await this.sequelize.query(sql, { type: QueryTypes.DELETE });
	}

	/**
	 * 注意: where条件必须在set条件之后
	 * @param {string} sql 如: update test set user_id='asdasdasd1234' where id='sad23asd345dfg';
	 * @returns {Promise<[null, number]>}
	 * @memberof SqlBase
	 */
	public async updateExecute(sql: string): Promise<[null, number]> {
		return await this.sequelize.query(sql, { type: QueryTypes.UPDATE });
	}

	// /**
	//  * update的是: duplicate key 后面的数据
	//  * @param {string} sql 如: insert into test (id, user_id, type, create_at, updated_at) values ('test12345ss', 'sssaa', 'ws', '2022-4-13 21:10:12', '2022-4-13 21:10:12') on duplicate key update id='test12345ss1', user_id='sssaa1';
	//  * @returns {Promise<[number, boolean]>} [0, true]代表insert，[0, false]代表update
	//  * @memberof SqlBase
	//  */
	// public async upsertExecute(sql: string): Promise<[number, boolean]> {
	//     return await this.sequelize.query(sql, { type: QueryTypes.UPSERT }) as unknown as [number, boolean];
	// }

	/**
	 * @param {string} sql 如: select * from test;
	 * @returns {Promise<Array<TM & SqlHas>>}
	 * @memberof SqlBase
	 */
	public async selectExecute(sql: string): Promise<Array<TM & SqlHas>> {
		return await this.sequelize.query(sql, { type: QueryTypes.SELECT });
	}
}
