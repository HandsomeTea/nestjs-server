// 管道可以用于对通用参数的验证
// 可全局注册，也可单独在controller中注册，优先执行全局注册的管道
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Exception, HttpError, log } from '@/configs';

@Injectable()
export class ValidationPipe implements PipeTransform {
	/**
	 *
	 *
	 * @param {unknown} value 要验证的参数
	 * @param {ArgumentMetadata} metadata 即DTO所在的class
	 * @returns
	 * @memberof ValidationPipe
	 */
	async transform(value: unknown, metadata: ArgumentMetadata) {
		if (!metadata) {
			return value;
		}
		// 将对象转换为 Class 来验证
		const object = plainToInstance(metadata.metatype, value);
		const errors = await validate(object);

		if (errors.length > 0) {
			const msg = errors.map(a => Object.values(a.constraints).join(',')).join(',');

			log(metadata.metatype.name).error(errors);
			throw new Exception(msg, HttpError.INVALID_DATA_RATE);
		}
		return value;
	}
}
