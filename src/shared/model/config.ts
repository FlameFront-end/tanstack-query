const mode = import.meta.env.MODE

const isDevelopment = mode === 'development'
const isProduction = mode === 'production'
const isTest = mode === 'test'

const API_BASE_URL =
	import.meta.env.VITE_API_URL?.trim() ||
	(isProduction ? 'https://api.production.com' : 'http://localhost:3000')

if (!API_BASE_URL) {
	throw new Error('API_BASE_URL is not defined or empty')
}

const API_DEFAULT_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 30_000)

const API_ENABLE_MOCKS =
	import.meta.env.VITE_API_MOCKS?.toLowerCase() === 'true'

export const appConfig = {
	isDevelopment,
	isProduction,
	isTest,
	api: {
		baseUrl: API_BASE_URL,
		timeout: API_DEFAULT_TIMEOUT,
		enableMocks: API_ENABLE_MOCKS
	}
} as const
