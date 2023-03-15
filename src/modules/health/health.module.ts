import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
// import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './health.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		TerminusModule,
		ConfigModule.forRoot({
			envFilePath: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? ['.env.local'] : []
		})
		// MongooseModule.forRoot(process.env.DB_URL)
	],
	controllers: [HealthController]
})
export class HealthModule {}
