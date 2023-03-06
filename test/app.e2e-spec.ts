import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RootModule } from '@/module';

describe('AppController (e2e)', () => {
	let app: INestApplication = null;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [RootModule]
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/test (GET)', () => {
		return request(app.getHttpServer()).get('/test').expect(200).expect('Hello World!');
	});
});
