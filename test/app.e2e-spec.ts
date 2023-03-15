import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { V1AppModule } from '@/modules';

describe('v1 (e2e)', () => {
	let app: INestApplication = null;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [V1AppModule]
		}).compile();

		app = moduleFixture.createNestApplication();
		app.setGlobalPrefix('api/v1');
		await app.init();
	});

	it('/api/v1/user (GET)', () => {
		return request(app.getHttpServer())
			.get('/api/v1/user')
			.expect(200)
			// .expect(res => {
			// 	console.log(res.body);
			// })
			.end();
	});
});
