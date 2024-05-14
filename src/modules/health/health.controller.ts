import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, /*MongooseHealthIndicator, SequelizeHealthIndicator,*/ PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaClient } from '@prisma/client';

/** /api/health */
@Controller('health')
export class HealthController {
	constructor(
		private health: HealthCheckService,
		// private mongoose: MongooseHealthIndicator,
		// private sequelize: SequelizeHealthIndicator,
		private prisma: PrismaHealthIndicator
	) { }

	@Get()
	@HealthCheck()
	async check() {
		return await this.health.check([
			// async () => await this.mongoose.pingCheck('mongoose')
			// async () => await this.sequelize.pingCheck('sequelize')
			async () => await this.prisma.pingCheck('prisma', new PrismaClient())
		]);
	}
}
