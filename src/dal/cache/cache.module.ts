import { Module } from '@nestjs/common';
import { RedisModule } from '@svtslv/nestjs-ioredis';
import { cacheProvider } from './cache.providers';

@Module({
	imports: [
		RedisModule.forRootAsync({
			useFactory: () => {
				const { hostname, port, password } = new URL(process.env.REDIS_URL);

				return {
					config: {
						host: hostname,
						port: parseInt(port),
						password
					}
				};
			}
		})
	],
	providers: [cacheProvider],
	exports: [cacheProvider]
})
export class CacheModule { }
