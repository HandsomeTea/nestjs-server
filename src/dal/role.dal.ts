import { Inject, Injectable } from '@nestjs/common';
import { Roles, Users } from '@/db/db.models';
import { passwordEncrypted } from '@coco-sheng/js-tools';

export const innerAdminId = '000000000000000000000000';

@Injectable()
export class RoleDal {
	constructor(
        @Inject('ROLE_MODEL') private role: Roles,
        @Inject('USER_MODEL') private user: Users
	) { }

	async onApplicationBootstrap(): Promise<void> {
		let innerRole = await this.role.findOne({ type: 'INNER_ADMIN' });

		if (!innerRole) {
			innerRole = await this.role.insertOne({
				type: 'INNER_ADMIN',
				name: 'admin',
				permission: { all: ['*'] }
			});
		}
		const user = await this.user.findOne({ role: innerRole._id.toString() });

		if (!user) {
			await this.user.insertOne({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				_id: innerAdminId,
				name: 'admin',
				phone: { number: process.env.INNER_ACCOUNT, verify: false },
				type: ['ADMIN'],
				status: 'ACTIVE',
				role: [innerRole._id.toString()],
				...(() => {
					const pwd = passwordEncrypted(process.env.INNER_ACCOUNT_PASSWORD);

					return {
						password: {
							bcrypt: pwd.encrypted,
							algorithm: pwd.algorithm,
							updateAt: new Date()
						}
					};
				})()
			});
		}
	}

	async findById(id: string) {
		return await this.role.findOne({ _id: id, type: { $ne: 'INNER_ADMIN' } });
	}

	async findByIds(ids: Array<string>) {
		return await this.role.find({ _id: { $in: ids } });
	}

	async find(option: { id?: string | Array<string>, name?: string }) {
		const { id, name } = option;

		return await this.role.find({
			...id ? { _id: typeof id === 'string' ? id : { $in: id } } : {},
			...name ? { name: { $regex: name, $options: 'i' } } : {},
			type: { $ne: 'INNER_ADMIN' }
		});
	}

	async paging(option: { keyword?: string, skip?: number, limit?: number }) {
		const { keyword, skip = 0, limit = 10 } = option;

		return await this.role.paging({
			...keyword ? { name: { $regex: keyword, $options: 'i' } } : {},
			type: { $ne: 'INNER_ADMIN' }
		}, limit, skip, { createdAt: 'desc' });
	}

	async updateOne(id: string, update: { name?: string, permission?: Record<string, Array<string>> }) {
		const { name, permission } = update;

		return await this.role.updateOne({ _id: id, type: { $ne: 'INNER_ADMIN' } }, {
			$set: {
				...name ? { name } : {},
				...permission ? { permission } : {}
			}
		});
	}

	async deleteById(id: string | Array<string>) {
		return await this.role.deleteMany({ _id: typeof id === 'string' ? id : { $in: id }, type: { $ne: 'INNER_ADMIN' } });
	}

	async create(role: { name: string, permission: Record<string, Array<string>> }) {
		return await this.role.insertOne({ ...role, type: 'CUSTOMER' });
	}

	async findOne(option: { id?: string, name?: string }) {
		const { id, name } = option;

		return await this.role.findOne({
			...id ? { _id: id } : {},
			...name ? { name } : {}
		});
	}
}

export const RoleDalProvider = {
	provide: 'ROLE_DAL',
	useClass: RoleDal
};
