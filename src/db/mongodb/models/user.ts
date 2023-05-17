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

// class UserBase extends BaseModel<UserData> {
// 	constructor() {
// 		super('user', SchemaFactory.createForClass(UserSchema));
// 	}
// }

// export default class User extends UserBase {
// 	constructor() {
// 		super();
// 	}

// 	async findByIdWithCache(_id: string): Promise<Readonly<MongoHas & UserData>> {
// 		return await this.findById(_id);
// 	}
// }
