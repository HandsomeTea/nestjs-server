import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MasterModule } from '@/modules';
import { ConfigModule } from '@nestjs/config';

describe('v1 (e2e)', () => {
	let app: INestApplication = null;

	// 测试结束后如何自动关闭mongodb连接

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					envFilePath: ['.env.local']
				}),
				MasterModule
			]
		}).compile();

		app = moduleFixture.createNestApplication();
		app.setGlobalPrefix('api/v1');
		await app.init();
	});

	it('/api/v1/user (GET)', () => {
		return (
			request(app.getHttpServer())
				.get('/api/v1/user')
				.expect(200)
				.expect(() => {
					// console.log(res.body);
				})
		);
	});
});
