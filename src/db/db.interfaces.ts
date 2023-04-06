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

export type UserData = {
	// id: number;
	name: string;
}

export type UserModel = Readonly<MongoHas & UserData>
// export type UserModel = Readonly<SqlHas & UserData>


export type KeysOf<T> = { [P in keyof T]?: T[P] | unknown };
