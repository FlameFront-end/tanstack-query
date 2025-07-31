import axios, {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse
} from 'axios'
import { APP_CONFIG } from '@/shared/model/config'
import { toast } from 'react-toastify'
import {
	ApiError,
	ErrorHandlingConfig,
	NetworkError,
	isApiError,
	ErrorCode,
	isErrorCode
} from '@/shared/types'
import { ROUTES } from '@/shared/model/routes'

type AxiosErrorWithCode = AxiosError & { code?: ErrorCode }

const defaultErrorConfig: ErrorHandlingConfig = {
	showToast: true,
	logToConsole: !APP_CONFIG.isProduction,
	redirectOnAuthError: ROUTES.LOGIN
}

export const apiClient: AxiosInstance = axios.create({
	baseURL: APP_CONFIG.api.baseUrl,
	timeout: APP_CONFIG.api.timeout,
	headers: {
		'Content-Type': 'application/json'
	}
})

apiClient.interceptors.request.use(config => {
	// const token = authStore.getToken()
	// if (token) config.headers.Authorization = `Bearer ${token}`
	return config
})

apiClient.interceptors.response.use(
	(res: AxiosResponse) => res,
	(error: AxiosErrorWithCode) => {
		if (error.code === 'ERR_CANCELED') return Promise.reject(error)

		const resData = error.response?.data as
			| Record<string, unknown>
			| undefined

		const {
			code: rawCode,
			message: rawMessage,
			details,
			timestamp
		} = resData ?? {}

		const apiError: ApiError = {
			status: error.response?.status || 500,
			code: isErrorCode(rawCode) ? rawCode : 'UNKNOWN_ERROR',
			message:
				typeof rawMessage === 'string' ? rawMessage : error.message,
			details: isRecord(details) ? details : undefined,
			timestamp: typeof timestamp === 'string' ? timestamp : undefined
		}

		return Promise.reject(apiError)
	}
)

function isRecord(value: unknown): value is Record<string, unknown> {
	return (
		value !== null &&
		typeof value === 'object' &&
		Object.keys(value).length > 0
	)
}

function handleApiError(
	error: unknown,
	config: ErrorHandlingConfig = {}
): never {
	const merged = { ...defaultErrorConfig, ...config }

	if (axios.isAxiosError(error)) {
		if (error.code === 'ERR_CANCELED') throw error

		if (!error.response) {
			if (merged.logToConsole)
				console.error('Network Error:', error.message)
			if (merged.showToast) toast.error('Network error')

			throw <NetworkError>{
				isNetworkError: true,
				message: 'Network error',
				originalError: error
			}
		}
	}

	if (isApiError(error)) {
		if (merged.logToConsole)
			console.error(`API Error [${error.code}]:`, error.message)
		if (merged.showToast) toast.error(error.message)

		if (error.code === 'UNAUTHORIZED' && merged.redirectOnAuthError) {
			window.location.href = merged.redirectOnAuthError
		}

		throw error
	}

	if (merged.logToConsole) console.error('Unknown error:', error)
	if (merged.showToast) toast.error('Unknown error')

	throw <ApiError>{
		status: 500,
		code: 'UNKNOWN_ERROR',
		message: 'Unknown error occurred'
	}
}

export async function apiRequest<T>(
	config: AxiosRequestConfig,
	errorConfig?: ErrorHandlingConfig
): Promise<T> {
	try {
		const response = await apiClient.request<T>(config)
		return response.data
	} catch (error) {
		return handleApiError(error, errorConfig)
	}
}
