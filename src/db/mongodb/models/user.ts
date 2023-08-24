import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseModel from './base';

@Schema()
class UserSchema {
	@Prop() name: string;
}


export default class User extends BaseModel<UserModel> {
	constructor() {
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
