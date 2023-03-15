import { Table, Model, Column, PrimaryKey, AllowNull } from 'sequelize-typescript';
import BaseModel from './base';
import { UserModel } from '../interface';

@Table({ modelName: 'user', createdAt: true, updatedAt: true })
// @BaseModel
export default class User extends BaseModel<UserModel> {
	@PrimaryKey
	@Column({ autoIncrement: true })
	id: number;

	@AllowNull
	@Column
	name: string;
}
