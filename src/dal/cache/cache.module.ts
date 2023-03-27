import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-ioredis';
import { cacheProvider } from './cache.providers';

console.log('===============================================');
console.log(`process.env.REDIS_URL: ${process.env.REDIS_URL}`);
console.log('===============================================');
@Module({
	imports: [
		RedisModule.forRoot((() => {
			// const { hostname, port, password } = new URL(process.env.REDIS_URL);
			const { hostname, port, password } = new URL('redis://127.0.0.1:6379');

			setTimeout(() => {
				console.log('===============================================');
				console.log(`process.env.REDIS_URL: ${process.env.REDIS_URL}`);
				console.log('===============================================');
			}, 10);
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
