import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { DalModule } from '@/dal';

@Module({
	imports: [DalModule],
	controllers: [RoleController],
	providers: [DalModule, RoleService]
})
export class RoleModule { }
