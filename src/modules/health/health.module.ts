import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
// import { MongooseModule } from '@nestjs/mongoose';
// import { SequelizeModule } from '@nestjs/sequelize';
import { HealthController } from './health.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		TerminusModule,
		ConfigModule.forRoot({
			envFilePath: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? ['.env.local'] : []
		})
		// MongooseModule.forRoot(process.env.DB_URL)
		// SequelizeModule.forRoot((() => {
		// 	const { hostname, port, username, password, pathname } = new URL(process.env.DB_URL);

		// 	return {
		// 		dialect: 'postgres',
		// 		host: hostname,
		// 		port: parseInt(port),
		// 		username,
		// 		password,
		// 		database: pathname.substring(1),
		// 		autoLoadModels: true,
		// 		synchronize: true
		// 	};
		// })())
	],
	controllers: [HealthController]
})
export class HealthModule { }
