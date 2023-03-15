import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UsersProvider } from '@/db/mongodb/mongodb.providers';
import { MongodbModule } from '@/db/mongodb/mongodb.module';
import { ConfigModule } from '@nestjs/config';

describe('UserController', () => {
	let controller: UserController = null;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				MongodbModule,
				ConfigModule.forRoot({ envFilePath: ['.env.local'] })
			],
			controllers: [UserController],
			providers: [UserService, UsersProvider]
		}).compile();

		controller = module.get<UserController>(UserController);
	});

	it('should be defined', async () => {
		expect(await controller.create({ name: 'test' })).toHaveProperty('_id');
	});
});
