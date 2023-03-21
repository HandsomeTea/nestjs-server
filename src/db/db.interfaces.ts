import { Types } from 'mongoose';
export interface MongoHas {
	_id: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

export interface SqlHas {
	createdAt: Date;
	updatedAt: Date;
}

// export interface UserModel {
//     id: number;
//     name: string;
// }

export interface UserModel {
	readonly name: string;
}


export type KeysOf<T> = { [P in keyof T]?: T[P] | unknown };
