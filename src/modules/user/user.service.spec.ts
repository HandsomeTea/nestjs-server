import { MongodbModule } from '@/db/mongodb/mongodb.module';
import { UsersProvider } from '@/db/mongodb/providers/user.providers';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
	let service: UserService = null;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				MongodbModule,
				ConfigModule.forRoot({
					envFilePath: ['.env.local']
				})
			],
			providers: [UserService, UsersProvider]
		}).compile();

		service = module.get<UserService>(UserService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
