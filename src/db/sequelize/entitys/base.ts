import { Model } from 'sequelize-typescript';
import { SqlHas } from '../interface';

export default class SequelizeBase<TM> extends Model<TM> {
	private modelName: string;

	constructor(...args) {
		super(...args);
		this.modelName = args[0];
	}

	private get model() {
		return this.sequelize.model(this.modelName);
	}

	async insertOne(data): Promise<TM & SqlHas> {
		return (await this.model.create(data)).dataValues;
	}
}
