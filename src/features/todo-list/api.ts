import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'

import { apiRequest } from '@/shared/api/api-instance'
import {
	ApiRequestOptions,
	PaginatedParams,
	PaginatedResult,
	TodoDto
} from '@/shared/types'

const DEFAULT_PER_PAGE = 10

const fetchTodoList = (
	{ page, perPage = DEFAULT_PER_PAGE }: PaginatedParams,
	{ signal }: ApiRequestOptions = {}
): Promise<PaginatedResult<TodoDto>> => {
	return apiRequest<PaginatedResult<TodoDto>>({
		method: 'get',
		url: '/tasks',
		signal,
		params: {
			_page: page,
			_per_page: perPage
		}
	})
}

export const todoListApi = {
	getTodoList: fetchTodoList,

	getTodoListInfiniteQueryOptions: () =>
		infiniteQueryOptions({
			queryKey: ['tasks', 'list'],
			queryFn: ({ pageParam = 1, signal }) =>
				fetchTodoList({ page: pageParam }, { signal }),
			initialPageParam: 1,
			getNextPageParam: lastPage => lastPage.next,
			select: data => data.pages.flatMap(page => page.data)
		}),

	getTodoListQueryOptions: (params: PaginatedParams) => {
		const { page, perPage = DEFAULT_PER_PAGE } = params
		return queryOptions<PaginatedResult<TodoDto>, Error>({
			queryKey: ['tasks', 'list', { page, perPage }],
			queryFn: ({ signal }) =>
				fetchTodoList({ page, perPage }, { signal })
		})
	}
}
