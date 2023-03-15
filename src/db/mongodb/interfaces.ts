import { Types } from 'mongoose';
export interface MongoHas {
	_id: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserModel {
	readonly name: string;
}
