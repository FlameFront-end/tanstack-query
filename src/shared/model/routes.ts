import 'react-router-dom'

type ExtractRouteParams<T extends string> = string extends T
	? Record<string, string>
	: T extends `${string}:${infer Param}/${infer Rest}`
		? { [K in Param | keyof ExtractRouteParams<Rest>]: string }
		: T extends `${string}:${infer Param}`
			? { [K in Param]: string }
			: Record<string, never>

export const ROUTES = {
	HOME: '/',
	TODOS: '/todos',
	TODO: '/todos/:todoId'
} as const

export type RouteParams = {
	[K in keyof typeof ROUTES]: ExtractRouteParams<(typeof ROUTES)[K]>
}
