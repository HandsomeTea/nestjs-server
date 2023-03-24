import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-ioredis';
import { cacheProvider } from './cache.providers';

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
		})())
	],
	providers: [cacheProvider],
	exports: [cacheProvider]
})
export class CacheModule { }
