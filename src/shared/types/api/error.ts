export type ApiError<
	T extends Record<string, unknown> = Record<string, unknown>
> = {
	status: number
	code: ErrorCode
	message: string
	details?: T
	timestamp?: string
}

export const ERROR_CODES = [
	'VALIDATION_FAILED',
	'UNAUTHORIZED',
	'FORBIDDEN',
	'NOT_FOUND',
	'INTERNAL_SERVER_ERROR',
	'NETWORK_ERROR',
	'TOKEN_EXPIRED',
	'RATE_LIMIT_EXCEEDED',
	'ERR_CANCELED',
	'UNKNOWN_ERROR'
] as const

export type ErrorCode = (typeof ERROR_CODES)[number]

export function isErrorCode(code: unknown): code is ErrorCode {
	return typeof code === 'string' && ERROR_CODES.includes(code as ErrorCode)
}

export type ValidationErrorDetails = {
	field: string
	message: string
	type: string
	value?: unknown
}[]

export type ValidationError = ApiError<{
	errors: ValidationErrorDetails
}>

export type ErrorHandlingConfig = {
	showToast?: boolean
	logToConsole?: boolean
	redirectOnAuthError?: string
}

export type NetworkError = {
	isNetworkError: true
	message: string
	originalError: unknown
}

export function isApiError(error: unknown): error is ApiError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'status' in error &&
		'code' in error &&
		'message' in error
	)
}
