import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-ioredis';
import { cacheProvider } from './cache.providers';

@Module({
	imports: [
		RedisModule.forAsync({ name: 'test' }, {
			useFactory: () => {
				const { hostname, port, password } = new URL(process.env.REDIS_URL);

				return [
					{
						host: hostname,
						port: parseInt(port),
						password
					}
				];
			}
		}
		)
	],
	providers: [cacheProvider],
	exports: [cacheProvider]
})
export class CacheModule { }
