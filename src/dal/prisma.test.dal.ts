import { Inject, Injectable } from '@nestjs/common';
import { PrismaServer } from '@/db/prisma/prisma.providers';

@Injectable()
export class PrismaTestDal {
	constructor(
		@Inject('PRISMA') private prisma: PrismaServer
	) { }

	private get model() {
		return this.prisma.test;
	}

	async find() {
		return await this.model.findMany({
			where: {
				name: '18612345678'
			}
		});
	}
}

export const PrismaTestDalProvider = {
	provide: 'PRISMA_TEST_DAL',
	useClass: PrismaTestDal
};
