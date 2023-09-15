import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseModel from './base';

@Schema()
class UserSchema {
	@Prop({ type: String, required: true, trim: true }) name: string;
	@Prop({ type: Object }) phone?: { number: string, verify: boolean };
	@Prop({ type: Object }) email?: { address: string, verify: boolean };
	@Prop({ type: Object }) password?: { bcrypt: string, algorithm: 'sha-256' | 'sha-1', updateAt: Date, wrongTimes?: number, unLockAt?: Date };
	@Prop({ type: Array }) role: Array<'user'>;
	@Prop({ type: Object }) avatar?: { url: string, updateAt: Date };
	@Prop({ type: String }) status: 'active';
	@Prop({ type: Date }) lastLogin: Date;
	@Prop({ type: Date }) firstLogin: Date;
}


export default class User extends BaseModel<UserModel> {
	constructor() {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		super('user', SchemaFactory.createForClass(UserSchema));
	}
}

// class UserBase extends BaseModel<UserModel> {
// 	constructor() {
// 		super('user', SchemaFactory.createForClass(UserSchema));
// 	}
// }

// export default class User extends UserBase {
// 	constructor() {
// 		super();
// 	}

// 	async findByIdWithCache(_id: string) {
// 		return await this.findById(_id);
// 	}
// }
