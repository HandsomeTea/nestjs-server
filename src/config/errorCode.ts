export const HttpErrorType = {
	BE_LOGOUT: 401,
	INVALID_DATA_RATE: 401
} as const;

/**
 * 自定义错误码
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const HttpError: Record<keyof typeof HttpErrorType, keyof typeof HttpErrorType> = {} as const;

for (const key in HttpErrorType) {
	HttpError[key] = key;
}
