import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Exception, ErrorCode, log } from '@/configs';
import { typeIs } from '@coco-sheng/js-tools';

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

		if (typeIs(object) !== 'object') {
			return value;
		}
		const errors = await validate(object);

		if (errors.length > 0) {
			log(metadata.metatype.name).error(errors);
			const msgs: Array<string> = [];

			errors.map(a => msgs.push(...Object.values(a.constraints)));
			msgs.map((a, i) => {
				msgs[i] = `${i + 1}、${a}`;
			});
			throw new Exception(`Parameters do not conform to api requirements: ${msgs.join(' ')}`, ErrorCode.INVALID_ARGUMENTS);
		}
		return value;
	}
}
