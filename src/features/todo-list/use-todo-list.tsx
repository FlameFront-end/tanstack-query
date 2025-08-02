import { useInfiniteQuery } from '@tanstack/react-query'
import { todoListApi } from '@/features/todo-list/api'
import { useIntersection } from '@/shared/hooks'

export function useTodoList() {
	const {
		data: todoItems,
		error,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage
	} = useInfiniteQuery({
		...todoListApi.getTodoListInfiniteQueryOptions()
	})

	const cursorRef = useIntersection(() => {
		void fetchNextPage()
	})

	const cursor = (
		<div ref={cursorRef}>
			{!hasNextPage && <div>Нет данных для загрузки</div>}
			{isFetchingNextPage && <div>Loading</div>}
		</div>
	)

	return { error, todoItems, isLoading, cursor }
}
