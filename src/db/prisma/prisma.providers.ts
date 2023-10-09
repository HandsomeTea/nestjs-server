import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaServer extends PrismaClient implements OnModuleInit {
	async onModuleInit() {
		await this.$connect();
	}
}

export const dbConnectProvider = {
	provide: 'PRISMA',
	useClass: PrismaServer
};
