import { CacheService } from './cache.service';

export const cacheProvider = {
	provide: 'CACHE_MODEL',
	useClass: CacheService
};
