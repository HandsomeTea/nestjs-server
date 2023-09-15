import axios, { AxiosResponse, AxiosError, Method, AxiosInstance, InternalAxiosRequestConfig, AxiosRequestHeaders, ResponseType } from 'axios';
import * as Agent from 'agentkeepalive';

import { Inject, Injectable, Module } from '@nestjs/common';
import { JwtModule, JWT } from './JWT';
import * as httpContext from 'express-http-context';
import { ErrorCode, Exception, log, traceId } from '@/configs';

type HttpArgumentOption = {
	headers?: AxiosRequestHeaders
	query?: Record<string, unknown>
	body?: Record<string, unknown>
}

@Injectable()
export class ServerRequest {
	private service: AxiosInstance;
	constructor(@Inject('JWT') private Jwt: JWT) {
		this.service = this.getService();
	}

	private getService() {
		const service = axios.create({
			timeout: 10000,
			httpAgent: new Agent({
				keepAlive: true,
				timeout: 60000, // active socket keepalive for 60 seconds
				freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
				socketActiveTTL: 100
			})
		});

		// 请求拦截器
		service.interceptors.request.use(config => this.beforeSendToServer(config), this.beforeSendToServerButError);
		// 响应拦截器
		service.interceptors.response.use(this.receiveSuccessResponse, this.receiveResponseNotSuccess);
		return service;
	}

	private beforeSendToServer(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
		if (!config.headers.Authorization) {
			config.headers.Authorization = this.Jwt.sign();
		}

		if (!config.headers['x-b3-spanid']) {
			config.headers['x-b3-spanid'] = traceId();
		}

		if (!config.headers['x-b3-traceid']) {
			config.headers['x-b3-traceid'] = httpContext.get('traceId') || traceId();
		}

		if (!config.headers['x-b3-parentspanid']) {
			config.headers['x-b3-parentspanid'] = httpContext.get('spanId');
		}

		if (!config.headers['x-user']) {
			config.headers['x-user'] = httpContext.get('userId') || '';
		}

		if (!config.headers['x-auth']) {
			config.headers['x-auth'] = httpContext.get('token') || '';
		}

		const { url, baseURL, method, params, data, headers } = config;
		const address = new URL(`${baseURL ? baseURL + url : url}`);

		log(`request-to:[(${method}) ${address.origin + address.pathname}]`).info(JSON.stringify({
			headers,
			query: Object.keys(params || {}).length > 0 ? params : (() => {
				const obj: Record<string, string> = {};

				[...address.searchParams.entries()].map(a => obj[a[0]] = a[1]);
				return obj;
			})(),
			body: data || {}
		}, null, '   '));

		return config;
	}

	private async beforeSendToServerButError(error): Promise<Exception> {
		log('request-to-other-server').error(error);
		throw new Exception(error.message, 500);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private async receiveSuccessResponse(response: AxiosResponse): Promise<any> {
		// 这里只处理 response.status >= 200 && response.status <= 207 的情况
		const { data, config: { method, baseURL, url }/*, headers, request, status, statusText*/ } = response;
		const address = new URL(`${baseURL ? baseURL + url : url}`);

		log(`response-from:[(${method}) ${address.origin + address.pathname}]`).info(JSON.stringify(data, null, '   '));
		return Promise.resolve(data);
	}

	private async receiveResponseNotSuccess(error: AxiosError): Promise<Exception> {
		const { response, config, request } = error;

		let target = null;

		if (config) {
			const { url, baseURL, method } = config;

			target = `(${method}): ${baseURL ? baseURL + url : url}`;
		} else if (request) {
			target = request.responseURL;
		} else {
			log('response-from-other-server-error').error(error);
			throw new Exception(error.message, 500);
		}
		const address = new URL(config ? `${config.baseURL ? config.baseURL + config.url : config.url}` : `${target}`);
		const _target = config ? `(${config.method}) ${address.origin + address.pathname}` : address.origin + address.pathname;

		if (response) {
			const { status, statusText, data } = response;

			log(`response-from:[${_target}]`).error({
				status,
				statusText,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				...typeof data === 'string' ? { message: data } : data
			});
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			// throw new Exception(data.message);
			throw new Exception(data as ExceptionInstance);
		}

		log(`response-from:[${_target}]`).error(error);
		throw new Exception(`request to ${target} error : no response.`, ErrorCode.INTERNAL_SERVER_ERROR);
	}

	private async send(url: string, method: Method, options?: HttpArgumentOption, params?: { baseURL?: string, responseType?: ResponseType }): Promise<AxiosResponse> {
		return await this.service.request({
			url,
			method,
			headers: options?.headers,
			params: options?.query,
			data: options?.body,
			...params
		});
	}

	private async sendToMessageServer(url: string, method: Method, options: HttpArgumentOption) {
		return await this.send(url, method, options, { baseURL: process.env.MESSAGE_SERVER_ADDR });
	}

	async checkLoginCode(code: string, option: { phone?: string, email?: string }) {
		return await this.sendToMessageServer(`/v1/code/${code}/check`, 'POST', { body: option });
	}
}


const HttpProvider = {
	provide: 'HTTP',
	useClass: ServerRequest
};

@Module({
	imports: [JwtModule],
	providers: [HttpProvider],
	exports: [HttpProvider]
})
export class HttpModule { }
