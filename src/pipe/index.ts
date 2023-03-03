// 管道可以用于对通用参数的验证
// 可全局注册，也可单独在controller中注册，优先执行全局注册的管道
import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	transform(value: any /*, metadata: ArgumentMetadata*/) {
		return value;
	}
}
