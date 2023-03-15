import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
	constructor(
		private health: HealthCheckService,
		private mongoose: MongooseHealthIndicator
	) { }

	@Get()
	@HealthCheck()
	async check() {
		return await this.health.check([
			async () => await this.mongoose.pingCheck('mongoose')
		]);
	}
}
