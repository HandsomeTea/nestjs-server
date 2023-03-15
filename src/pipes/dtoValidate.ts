import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Exception, HttpError, log } from '@/configs';

@Injectable()
export class ValidationDtoPipe implements PipeTransform {
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
