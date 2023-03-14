import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
	name: String
}, {
	versionKey: false,
	timestamps: { createdAt: true, updatedAt: true }
});
