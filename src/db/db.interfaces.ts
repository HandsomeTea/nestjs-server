import { Types } from 'mongoose';
export interface MongoHas {
	_id: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

// export interface SqlHas {
// 	createdAt: Date;
// 	updatedAt: Date;
// }

export type UserData = {
	name: string;
}

export type UserModel = Readonly<MongoHas & UserData>


export type KeysOf<T> = { [P in keyof T]?: T[P] | unknown };
