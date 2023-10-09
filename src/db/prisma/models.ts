/**
 * 1,创建 schema.prisma
 * 2,在根目录创建.env
 * 3,在 schema.prisma文件所在的目录运行 npx prisma generate
 *
 * 其它
 * npx prisma db pull ,将现有的数据库的表结构拉到schema.prisma中，数据库地址就是.env中环境变量配置的地址
 * npx prisma db push ,将schema.prisma中的表结构同步到.env中数据库地址环境变量配置的数据库中，相当于创建表
 * npx prisma -h ,查看更多有用的帮助
 */

/**
 * 该models文件完全没必要
 * models已经被prisma封装到client中，只需在dal中引入即可，不需要手动定义
 * prisma会根据本地生成的表结构定义文件，生成表结构的ts定义
 */
import { Test } from '@prisma/client';

export {
	Test as Tests
};
