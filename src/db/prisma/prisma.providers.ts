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
	provide: 'PRISMA_CONNECTION',
	useClass: PrismaServer
};

export const UserProvider = {
	provide: 'USER_MODEL',
	useFactory: () => new PrismaServer().user,
	inject: ['PRISMA_CONNECTION']
};

export const UserTokenProvider = {
	provide: 'USER_TOKEN_MODEL',
	useFactory: () => new PrismaServer().userToken,
	inject: ['PRISMA_CONNECTION']
};

export const RoleProvider = {
	provide: 'ROLE_MODEL',
	useFactory: () => new PrismaServer().role,
	inject: ['PRISMA_CONNECTION']
};
