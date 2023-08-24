export const HttpErrorType = {
	BE_LOGOUT: 401,
	USER_REQUEST_UNAUTHORIZED: 401,
	SERVER_REQUEST_UNAUTHORIZED: 403,
	INVALID_SERVER_AUTHORIZATION: 401,
	INVALID_ARGUMENTS: 400,
	INTERNAL_SERVER_ERROR: 500
} as const;

/**
 * 自定义错误码
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const ErrorCode: { [K in keyof typeof HttpErrorType]: K } = {} as const;

for (const key in HttpErrorType) {
	ErrorCode[key] = key;
}


/**
 * @api {post} error 数据结构
 * @apiName errorFormat
 * @apiGroup 接口异常
 * @apiVersion 1.0.0
 * @apiErrorExample Error-Response:
 * {
 *   "status": 500,
 *   "code": "USER_NO_PERMISSION",
 *   "message": "User Check Failure by userVerification",
 *   "reason": { }
 *   "source": [ "cemeta-user-manager" ],
 * }
 * @apiError {string} status 状态码
 * @apiError {string} code 错误码
 * @apiError {string} message 提示信息
 * @apiError {object} reason 错误信息中的变量(如有)信息
 * @apiError {array} source 错误链路
 */

/**
 * @api {post} code 错误码文档
 * @apiName 错误码
 * @apiGroup 错误码
 * @apiVersion 1.0.0
 * @apiError {string} BAD_REQUEST 默认400错误
 * @apiError {string} FORBIDDEN 默认403错误
 * @apiError {string} NOT_FOUND 默认404错误
 * @apiError {string} UNAUTHORIZED 默认401错误
 * @apiError {string} REQUEST_TIMEOUT 默认408错误
 * @apiError {string} TOO_MANY_REQUESTS 默认429错误
 * @apiError {string} URL_NOT_FOUND 请求地址未找到
 * @apiError {string} INTERNAL_SERVER_ERROR 服务器内部错误
 * @apiError {string} INVALID_ARGUMENTS 参数错误
 * @apiError {string} INVALID_LOGIN_TYPE 未知的登录方式
 * @apiError {string} USER_NOT_FOUND 用户未找到
 * @apiError {string} TOKEN_NOT_FOUND 登录令牌信息未找到
 * @apiError {string} USER_NO_PASSWORD 用户没有设置密码
 * @apiError {string} INVALID_PHONE 手机号格式不正确
 * @apiError {string} INVALID_EMAIL 邮箱格式不正确
 * @apiError {string} USER_REQUEST_UNAUTHORIZED 未获取到用户访问权限
 * @apiError {string} SERVER_REQUEST_UNAUTHORIZED 未获取到服务器访问权限
 * @apiError {string} INVALID_SERVER_AUTHORIZATION 非法的服务器授权
 * @apiError {string} BE_LOGOUT 已被登出
 * @apiError {string} INVALID_ACCOUNT 未知的账户数据
 * @apiError {string} USER_NEED_LOGIN token失效，需要重新登陆
 */
