import { Sequelize } from 'sequelize-typescript';
import { system } from '@/configs';

export const dbConnectProvider = {
	provide: 'SEQUELIZE_CONNECTION',
	useFactory: async () => {
		const sequelize = new Sequelize({
			dialect: 'postgres',
			host: 'localhost',
			port: 3306,
			username: 'root',
			password: 'password',
			database: 'nest',
			query: { raw: false },
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

		sequelize.authenticate().then(() => {
			system('sequelize').info(`sequelize connected on ${process.env.DB_URL} success and ready to use.`);
		}).catch(error => {
			system('sequelize').error(error);
		});

		await sequelize.sync();
		return sequelize;
	}
};

// export const UsersProvider = {
// 	provide: 'USER_MODEL',
// 	useFactory: () => (),
// 	inject: ['SEQUELIZE_CONNECTION']
// };
