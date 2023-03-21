import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DalModule } from '@/dal/dal.module';
import { UserService } from './user.service';

describe('UserService', () => {
	let service: UserService = null;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [DalModule, ConfigModule.forRoot({ envFilePath: ['.env.local'] })],
			providers: [UserService, DalModule]
		}).compile();

		service = module.get<UserService>(UserService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
