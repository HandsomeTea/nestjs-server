import { TerminusModule } from '@nestjs/terminus';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
	let controller: HealthController = null;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				TerminusModule,
				ConfigModule.forRoot({ envFilePath: ['.env.local'] }),
				MongooseModule.forRoot(process.env.DB_URL)
			],
			controllers: [HealthController]
		}).compile();

		controller = module.get<HealthController>(HealthController);
	});

	it('should be defined', async () => {
		expect(await controller.check()).toHaveProperty('status', 'ok');
	});
});
