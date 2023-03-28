import { Table, Column, PrimaryKey, AllowNull } from 'sequelize-typescript';
import BaseModel from './base';
import { UserData } from '@/db/db.interfaces';

@Table({ modelName: 'user', createdAt: true, updatedAt: true })
export default class User extends BaseModel<UserData> {
	/** 第一个参数为表名 */
	constructor(...args) {
		super(...args);
	}

	@PrimaryKey
	@Column({ autoIncrement: true })
		id: number;

	@AllowNull
	@Column
		name: string;
}
