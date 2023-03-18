import * as mongoose from 'mongoose';
import { system } from '@/configs';
import Users from './models/user';

export const dbConnectProvider = {
	provide: 'MONGODB_CONNECTION',
	useFactory: async (): Promise<typeof mongoose> => {
		mongoose.connection
			.once('connected', () => {
				system('mongodb').info(`mongodb connected on ${process.env.DB_URL} success and ready to use.`);
			})
			.on('disconnected', () => {
				system('mongodb').fatal('mongodb disconnected!');
			})
			.on('reconnected', () => {
				system('mongodb').info(`mongodb reconnect on ${process.env.DB_URL} success and ready to use.`);
			});
		return await mongoose.connect(process.env.DB_URL);
	}
};

export const UsersProvider = {
	provide: 'USER_MODEL',
	useFactory: () => new Users(),
	inject: ['MONGODB_CONNECTION']
};
