import { Sequelize } from 'sequelize-typescript';
import { system } from '@/configs';
import User from './entitys/user';

export const dbConnectProvider = {
	provide: 'SEQUELIZE_CONNECTION',
	useFactory: async () => {
		const { hostname, port, username, password } = new URL(process.env.DB_URL);
		const sequelize = new Sequelize({
			dialect: 'postgres',
			host: hostname,
			port: parseInt(port),
			username,
			password,
			database: 'nest',
			schema: 'public',
			define: {
				freezeTableName: true,
				charset: 'utf8'
			},
			logging: (...args) => {
				const [sql, { bind }] = args as unknown as [string, { bind: Array<string | number> | undefined }];

				if (bind) {
					system('sequelize-command').debug({
						sql,
						arguments: bind
					});
				} else {
					system('sequelize-command').debug(sql);
				}
			}
		});

		sequelize.addModels([User]);
		// await sequelize.sync();
		sequelize
			.authenticate()
			.then(() => {
				system('sequelize').info(`sequelize connected on ${process.env.DB_URL} success and ready to use.`);
			})
			.catch(error => {
				system('sequelize').error(error);
			});

		return sequelize;
	}
};

export const UserProvider = {
	provide: 'USER_MODEL',
	// useValue: User
	useFactory: () => new User('user'),
	inject: ['SEQUELIZE_CONNECTION']
};
