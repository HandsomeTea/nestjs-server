import { system } from '@/configs';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaServer extends PrismaClient implements OnModuleInit {
	async onModuleInit() {
		await this.$connect();

		system('prisma').info('prisma connect db successful and ready to use.');
	}
}

export const dbConnectProvider = {
	provide: 'PRISMA',
	useClass: PrismaServer
};
