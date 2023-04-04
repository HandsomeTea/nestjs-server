import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DalModule } from '@/dal';
import { ConfigModule } from '@nestjs/config';

describe('UserController', () => {
	let controller: UserController = null;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [DalModule, ConfigModule.forRoot({ envFilePath: ['.env.local'] })],
			controllers: [UserController],
			providers: [UserService, DalModule]
		}).compile();

		controller = module.get<UserController>(UserController);
	});

	it('should be defined', async () => {
		expect(await controller.create({ name: 'test' })).toHaveProperty('_id');
	});
});
