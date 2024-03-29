import * as mongoose from 'mongoose';
import { system } from '@/configs';
import Users from './models/user';
import UserTokens from './models/user-token';
import Roles from './models/role';

export const dbConnectProvider = {
	provide: 'MONGODB_CONNECTION',
	useFactory: async (): Promise<typeof mongoose> => {
		mongoose.connection
			.on('connected', () => {
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

export const UserProvider = {
	provide: 'USER_MODEL',
	useFactory: () => new Users(),
	inject: ['MONGODB_CONNECTION']
};

export const UserTokenProvider = {
	provide: 'USER_TOKEN_MODEL',
	useFactory: () => new UserTokens(),
	inject: ['MONGODB_CONNECTION']
};

export const RoleProvider = {
	provide: 'ROLE_MODEL',
	useFactory: () => new Roles(),
	inject: ['MONGODB_CONNECTION']
};
