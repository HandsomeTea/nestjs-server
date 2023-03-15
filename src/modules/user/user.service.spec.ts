import { DbModule } from '@/db/db.module';
import { UsersProvider } from '@/db/db.providers';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
	let service: UserService = null;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				DbModule,
				ConfigModule.forRoot({ envFilePath: ['.env.local'] })
			],
			providers: [UserService, UsersProvider]
		}).compile();

		service = module.get<UserService>(UserService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
