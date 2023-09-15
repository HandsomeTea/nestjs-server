import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseModel from './base';

@Schema()
class RoleSchema {
	@Prop({ type: String, required: true, trim: true }) name: string;
	@Prop({ type: Object }) permission: Record<string, Array<string>>;
}


export default class Role extends BaseModel<RoleModel> {
	constructor() {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		super('role', SchemaFactory.createForClass(RoleSchema));
	}
}
