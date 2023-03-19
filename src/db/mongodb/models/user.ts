import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserModel } from '../../db.interfaces';
import BaseModel from './base';

@Schema()
class UserSchema {
	@Prop()
		name: string;
}


export default class User extends BaseModel<UserModel> {
	constructor() {
		super('user', SchemaFactory.createForClass(UserSchema));
	}
}
