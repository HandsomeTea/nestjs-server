// import { Inject, Injectable } from '@nestjs/common';
// import { Roles, Users } from '@/db/db.models';
// import { passwordEncrypted } from '@coco-sheng/js-tools';

// export const innerAdminId = '00000000-0000-0000-0000-000000000000';

// @Injectable()
// export class RoleDal {
//     constructor(
//         @Inject('ROLE_MODEL') private role: Roles,
//         @Inject('USER_MODEL') private user: Users
//     ) {  }

//     private getModeledData(role?: any): RoleModel {
//         if (!role) {
//             return null;
//         }
//         return {
//             _id: role.id,
//             name: role.name,
//             permission: role.permission,
//             type: role.type,
//             createdAt: role.createdAt,
//             updatedAt: role.updatedAt
//         };
//     }

//     async onApplicationBootstrap(): Promise<void> {
//         let innerRole = await this.role.findFirst({ where: { type: 'INNER_ADMIN' } });

//         if (!innerRole) {
//             innerRole = await this.role.create({
//                 data: {
//                     type: 'INNER_ADMIN',
//                     name: 'admin',
//                     permission: { all: ['*'] }
//                 }
//             });
//         }
//         const user = await this.user.findFirst({
//             where: {
//                 role: { has: innerRole.id }
//             }
//         });

//         if (!user) {
//             await this.user.create({
//                 data: {
//                     id: innerAdminId,
//                     name: 'admin',
//                     phone: process.env.INNER_ACCOUNT,
//                     phoneVerify: true,
//                     type: ['ADMIN'],
//                     status: 'ACTIVE',
//                     role: [innerRole.id],
//                     ...(() => {
//                         const pwd = passwordEncrypted(process.env.INNER_ACCOUNT_PASSWORD);

//                         return {
//                             passwordBcrypt: pwd.encrypted,
//                             passwordAlgorithm: pwd.algorithm,
//                             passwordUpdateAt: new Date()
//                         };
//                     })()
//                 }
//             });
//         }
//     }

//     async find(option: { name?: string }) {
//         const { name } = option;

//         return (await this.role.findMany({
//             where: {
//                 ...name ? { name: { contains: name.toLowerCase() } } : {},
//                 type: { not: 'INNER_ADMIN' }
//             }
//         })).map(role => this.getModeledData(role));
//     }

//     async findById(id: string) {
//         return this.getModeledData(await this.role.findFirst({
//             where: {
//                 id,
//                 type: { not: 'INNER_ADMIN' }
//             }
//         }));
//     }

//     async findByIds(ids: Array<string>) {
//         return (await this.role.findMany({
//             where: {
//                 id: { in: ids }
//             }
//         })).map(this.getModeledData);
//     }

//     async paging(option: { keyword?: string, skip?: number, limit?: number }) {
//         const { keyword, skip = 0, limit = 10 } = option;

//         return {
//             list: (await this.role.findMany({
//                 where: {
//                     ...keyword ? { name: { contains: keyword.toLowerCase() } } : {},
//                     type: { not: 'INNER_ADMIN' }
//                 },
//                 skip,
//                 take: limit,
//                 orderBy: {
//                     createdAt: 'desc'
//                 }
//             })).map(role => this.getModeledData(role)),
//             total: await this.role.count({
//                 where: {
//                     ...keyword ? { name: { contains: keyword.toLowerCase() } } : {},
//                     type: { not: 'INNER_ADMIN' }
//                 }
//             })
//         };
//     }

//     async updateOne(id: string, update: { name?: string, permission?: Record<string, Array<string>> }) {
//         const { name, permission } = update;

//         return await this.role.update({
//             where: {
//                 id,
//                 type: { not: 'INNER_ADMIN' }
//             },
//             data: {
//                 ...name ? { name } : {},
//                 ...permission ? { permission } : {}
//             }
//         });
//     }

//     async deleteById(id: string | Array<string>) {
//         return await this.role.deleteMany({
//             where: {
//                 id: id === 'string' ? id : { in: id },
//                 type: { not: 'INNER_ADMIN' }
//             }
//         });
//     }

//     async create(role: { name: string, permission: Record<string, Array<string>> }) {
//         const result = await this.role.create({ data: { ...role, type: 'CUSTOMER' } });

//         return this.getModeledData(result);
//     }
// }

// export const RoleDalProvider = {
//     provide: 'ROLE_DAL',
//     useClass: RoleDal
// };
