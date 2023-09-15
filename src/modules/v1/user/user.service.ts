import { Inject, Injectable/*, HttpStatus*/ } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ErrorCode, Exception } from '@/configs';
import { UserDal, UserTokenDal } from '@/dal';
import { ServerRequest } from '@/providers/HTTP';
import { sha256, randomBy, displayPhone, passwordEncrypted, passwordVerify, isPhone, isEmail } from '@coco-sheng/js-tools';

@Injectable()
export class UserService {
	constructor(
		@Inject('USER_DAL') private user: UserDal,
		@Inject('USER_TOKEN_DAL') private userToken: UserTokenDal,
		@Inject('HTTP') private HTTP: ServerRequest
	) {
		// this.create({
		// 	name: 'coco',
		// 	phone: '13000000000',
		// 	email: '13000000000@qq.com',
		// 	password: '123456',
		// 	type: ['user'],
		// 	avatar: 'https://www.baidu.com/img/bd_logo1.png'
		// });
	}

	async create(user: CreateUserDto) {
		const { name, phone, email, password, type, avatar } = user;

		return await this.user.insertOne({
			name: name || phone && displayPhone(phone) || email,
			...phone ? { phone: { number: phone, verify: false } } : {},
			...email ? { email: { address: email, verify: false } } : {},
			...password ? (() => {
				const pwd = passwordEncrypted(password);

				return {
					password: {
						bcrypt: pwd.encrypted,
						algorithm: pwd.algorithm,
						updateAt: new Date()
					}
				};
			})() : {},
			...Array.isArray(type) && type.length > 0 ? { type } : { type: ['user'] },
			...avatar ? { avatar: { url: avatar, updateAt: new Date() } } : {},
			status: 'active'
		});
	}

	async findAll() {
		// return process.env.PORT;
		// throw new Exception('cuo le', ErrorCode.BE_LOGOUT);
		// throw new Exception('cuo le', HttpStatus.BAD_GATEWAY, { userid: '213123221' });
		return await this.user.find();
	}

	async findOne(id: string) {
		return await this.user.findById(id);
	}

	async update(id: string, updateUser: UpdateUserDto) {
		const { name, phone, email, password, type, avatar } = updateUser;

		return await this.user.updateOne(id, {
			name, phone, email,
			...password ? (() => {
				const pwd = passwordEncrypted(password);

				return {
					password: {
						bcrypt: pwd.encrypted,
						algorithm: pwd.algorithm,
						updateAt: new Date()
					}
				};
			})() : {},
			type, avatar
		});
	}

	async remove(id: string) {
		return await this.user.deleteOne(id);
	}

	private async generateLoginResult(userId: string, option?: { token?: string }): Promise<LoginResult> {
		const user = await this.user.findById(userId);

		if (!user) {
			throw new Exception('user is not found', ErrorCode.USER_NOT_FOUND);
		}
		let newToken = option?.token || '';

		if (!newToken) {
			newToken = randomBy(43, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_');
			const hashedToken = sha256(newToken, 'base64');

			await this.userToken.delete({ userId: user._id.toString() });
			await this.userToken.insertOne({
				userId: user._id.toString(),
				hashedToken
			});
		}

		if (!user.firstLogin) {
			await this.user.setUserFirstLogin(user._id);
		}
		await this.user.setUserLastLogin(user._id);

		return {
			token: newToken,
			user: {
				id: user._id,
				name: user.name || user.phone.number && displayPhone(user.phone.number) || user.email.address,
				phone: user.phone ? { number: displayPhone(user.phone.number) as string, verify: Boolean(user.phone.verify) } : {},
				email: user.email || {},
				type: user.type,
				role: user.role || []
			}
		};
	}

	private async loginByCode(code: string, option: { phone?: string, email?: string }) {
		const { email, phone, type } = await this.HTTP.checkLoginCode(code, option) as unknown as { type: 'login-phone-code' | 'login-email-code', email?: string, phone?: string };
		const createUserRole: Array<UserType> = ['user'];

		if (email && type === 'login-email-code') {
			const user = await this.user.findOne({ email });

			if (user) {
				if (!user.email.verify) {
					await this.user.setEmailVerify(user._id.toString(), true);
				}
				return await this.generateLoginResult(user._id.toString());
			} else {
				const userId = (await this.user.create({ email }, { verify: true, type: createUserRole }))._id.toString();

				return await this.generateLoginResult(userId);
			}
		}
		if (phone && type === 'login-phone-code') {
			const user = await this.user.findOne({ phone });

			if (user) {
				if (!user.phone.verify) {
					await this.user.setPhoneVerify(user._id.toString(), true);
				}
				return await this.generateLoginResult(user._id.toString());
			} else {
				const userId = (await this.user.create({ phone }, { verify: true, type: createUserRole }))._id.toString();

				return await this.generateLoginResult(userId);
			}
		}
	}

	private async loginByPassword(password: string, option: { phone?: string, email?: string }) {
		const { phone, email } = option;
		const user = await this.user.findOne({ email, phone });

		if (!user) {
			throw new Exception('user is not found!', ErrorCode.USER_NOT_FOUND);
		}
		if (!user.password.bcrypt) {
			throw new Exception('user is not set password!', ErrorCode.USER_NO_PASSWORD);
		}
		const dbPwd = user.password.bcrypt;

		if (passwordVerify(password, dbPwd)) {
			return await this.generateLoginResult(user._id.toString());
		}
		throw new Exception('account or password error!', ErrorCode.UNAUTHORIZED);
	}

	private async loginByToken(token: string) {
		const tokenInfo = await this.userToken.findOne({ hashedToken: sha256(token, 'base64') });

		if (!tokenInfo) {
			throw new Exception('you need to login again!', ErrorCode.UNAUTHORIZED);
		}

		return await this.generateLoginResult(tokenInfo.userId, { token });
	}

	async login(data: LoginDto) {
		const { type, payload: { account, password, code, token } } = data;

		if (type === 'code') {
			return await this.loginByCode(code, { phone: account, email: account });
		}

		if (type === 'pwd') {
			return this.loginByPassword(password, {
				...isPhone(account) ? { phone: account } : {},
				...isEmail(account) ? { email: account } : {}
			});
		}

		if (type === 'resume') {
			return this.loginByToken(token);
		}
	}
}
