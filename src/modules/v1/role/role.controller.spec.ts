import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { DalModule } from '@/dal';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

describe('RoleController', () => {
	let controller: RoleController = null;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [DalModule, ConfigModule.forRoot({ envFilePath: ['.env.local'] })],
			controllers: [RoleController],
			providers: [RoleService, DalModule]
		}).compile();

		controller = module.get<RoleController>(RoleController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
