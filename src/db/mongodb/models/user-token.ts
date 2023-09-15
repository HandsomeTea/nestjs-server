import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseModel from './base';

@Schema()
class UserTokenSchema {
	@Prop({ type: String }) userId: string;
	@Prop({ type: String, unique: true }) hashedToken: string;
	@Prop({ type: String }) appId: string;
	@Prop({ type: String }) companyId: string;
}

export default class UserToken extends BaseModel<UserTokenModel> {
	constructor() {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		super('user_token', SchemaFactory.createForClass(UserTokenSchema));
	}
}
