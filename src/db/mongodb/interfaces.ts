import { Document } from 'mongoose';

export interface UserModel extends Document {
    readonly name: string;
}
