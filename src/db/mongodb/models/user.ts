import { UserModel } from '../../db.interfaces';
import BaseModel from './base';

export default class User extends BaseModel<UserModel> {
	constructor() {
		super('user', {
			name: { type: String }
		});
	}
}
