import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
	let controller: UserController = null;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [UserService]
		}).compile();

		controller = module.get<UserController>(UserController);
	});

	it('should be defined', async () => {
		expect(await controller.getHello()).toBe('Hello World!');
	});
});
