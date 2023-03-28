import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserData } from '@/db/db.interfaces';
import BaseModel from './base';

@Schema()
class UserSchema {
	@Prop()
		name: string;
}


export default class User extends BaseModel<UserData> {
	constructor() {
		super('user', SchemaFactory.createForClass(UserSchema));
	}
}
