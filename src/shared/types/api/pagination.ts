export type PaginatedResult<T> = {
	data: T[]
	first: number
	items: number
	last: number
	next: number | null
	pages: number
	prev: number | null
}

export type PaginatedParams = {
	page: number
	perPage?: number
}
