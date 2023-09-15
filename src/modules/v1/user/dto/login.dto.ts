/** dto中，最终抛出的class的参数定义应与接口的参数定义相同 */

import { isEmail, isPhone } from '@coco-sheng/js-tools';
import { IsIn, registerDecorator, ValidationOptions, ValidatorConstraintInterface, ValidationArguments, ValidatorConstraint } from 'class-validator';

interface LoginArgs {
	type: 'pwd' | 'resume' | 'code'
	payload: {
		account?: string
		password?: string
		token?: string
		code?: string
	}
}

@ValidatorConstraint({ async: true })
class CheckAccountConstraint implements ValidatorConstraintInterface {
	validate(value: { type: LoginArgs['type'], account?: string }): Promise<boolean> | boolean {
		const { type, account } = value;

		if (type === 'resume') {
			return true;
		} else {
			return isPhone(account) || isEmail(account);
		}
	}

	defaultMessage(args: ValidationArguments): string {
		return `property ${args.property} must be email or phone number.`;
	}
}
const CheckAccount = (validationOptions?: ValidationOptions) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (object: Record<string, any>, propertyName: string): void => registerDecorator({
		name: 'CheckAccount',
		target: object.constructor,
		options: validationOptions,
		propertyName,
		validator: CheckAccountConstraint
	});
};

@ValidatorConstraint({ async: true })
class CheckLoginArgsConstraint implements ValidatorConstraintInterface {
	validate(value: { type: LoginArgs['type'] } & LoginArgs['payload']): Promise<boolean> | boolean {
		const { type, password, code, token } = value;

		switch (type) {
			case 'pwd':
				return Boolean(password && typeof password === 'string');
			case 'resume':
				return Boolean(token && typeof token === 'string');
			case 'code':
				return Boolean(code && typeof code === 'string');
			default:
				return false;
		}
	}

	defaultMessage(args: ValidationArguments): string {
		const { type } = args.value as { type: LoginArgs['type'] };

		return `login parameters ${type === 'code' ? 'code' : type === 'pwd' ? 'password' : 'token'} are not available.`;
	}
}
const CheckLoginArgs = (validationOptions?: ValidationOptions) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (object: Record<string, any>, propertyName: string): void => registerDecorator({
		name: 'CheckLoginArgs',
		target: object.constructor,
		options: validationOptions,
		propertyName,
		validator: CheckLoginArgsConstraint
	});
};


export class LoginDto {
	@IsIn(['pwd', 'resume', 'code'], { message: '未知的登录方式' })
	readonly type: LoginArgs['type'];

	readonly payload: LoginArgs['payload'];

	@CheckAccount()
	private get account(): { type: LoginArgs['type'], account?: string } {
		return {
			type: this.type,
			account: this.payload.account
		};
	}

	@CheckLoginArgs()
	private get loginArgs(): { type: LoginArgs['type'] } & LoginArgs['payload'] {
		return {
			type: this.type,
			...this.payload
		};
	}
}
