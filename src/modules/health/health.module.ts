import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { MongooseModule } from '@nestjs/mongoose';
// import { SequelizeModule } from '@nestjs/sequelize';
import { HealthController } from './health.controller';
// import { system } from '@/configs';

@Module({
	imports: [
		TerminusModule,
		MongooseModule.forRootAsync({
			useFactory: () => {
				return {
					uri: process.env.DB_URL
				};
			}
		})
		// SequelizeModule.forRootAsync({
		// 	useFactory: () => {
		// 		const { hostname, port, username, password, pathname } = new URL(process.env.DB_URL);

		// 		return {
		// 			dialect: 'postgres',
		// 			host: hostname,
		// 			port: parseInt(port),
		// 			username,
		// 			password,
		// 			database: pathname.substring(1),
		// 			autoLoadModels: true,
		// 			synchronize: true,
		// 			logging: (...args) => {
		// 				const [sql] = args as unknown as [string, { bind: Array<string | number> | undefined }];

		// 				system('sequelize-command').debug(sql);
		// 			}
		// 		};
		// 	}
		// })
	],
	controllers: [HealthController]
})
export class HealthModule { }
