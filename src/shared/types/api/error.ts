export type ApiError<T extends Record<string, unknown> = {}> = {
	status: number
	code: string
	message: string
	details?: T
	timestamp?: string
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
