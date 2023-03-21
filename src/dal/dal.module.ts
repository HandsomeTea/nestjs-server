import { DbModule } from '@/db/db.module';
import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-ioredis';
import { UserDalProvider } from './user';

@Module({
	imports: [
		RedisModule.forRoot((() => {
			const { hostname, port, password } = new URL(process.env.REDIS_URL);

			return [
				{
					name: 'test',
					host: hostname,
					port: parseInt(port),
					password
				}
			];
		})()),
		DbModule
	],
	providers: [UserDalProvider],
	exports: [UserDalProvider]
})
export class DalModule { }
