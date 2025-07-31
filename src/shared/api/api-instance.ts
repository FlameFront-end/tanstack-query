import axios, {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse
} from 'axios'
import { appConfig } from '@/shared/model/config'
import { toast } from 'react-toastify'
import {
	ApiError,
	ErrorHandlingConfig,
	NetworkError,
	isApiError
} from '@/shared/types'

type AxiosErrorWithCode = AxiosError & { code?: string }

const defaultErrorConfig: ErrorHandlingConfig = {
	showToast: true,
	logToConsole: !appConfig.isProduction,
	redirectOnAuthError: '/login'
}

export const apiClient: AxiosInstance = axios.create({
	baseURL: appConfig.api.baseUrl,
	timeout: appConfig.api.timeout,
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

		const resData = error.response?.data as Record<string, any> | undefined

		const apiError: ApiError = {
			status: error.response?.status || 500,
			code:
				typeof resData?.code === 'string' ? resData.code : 'API_ERROR',
			message:
				typeof resData?.message === 'string'
					? resData.message
					: error.message,
			details:
				typeof resData?.details === 'object'
					? resData.details
					: undefined,
			timestamp:
				typeof resData?.timestamp === 'string'
					? resData.timestamp
					: undefined
		}

		return Promise.reject(apiError)
	}
)

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
