import { useInfiniteQuery } from '@tanstack/react-query'
import { todoListApi } from './api'
import { useIntersection } from '@/shared/hooks'

export const TodoListPage = () => {
	const {
		data: todoItems,
		error,
		isLoading,
		isPlaceholderData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage
	} = useInfiniteQuery({
		...todoListApi.getTodoListInfiniteQueryOptions()
	})

	const cursorRef = useIntersection(() => {
		void fetchNextPage()
	})

	if (isLoading) {
		return <div>Loading</div>
	}

	if (error) {
		return <div>error: {JSON.stringify(error)}</div>
	}

	return (
		<div className='p-5 mx-auto max-w-[1200px] mt-10'>
			<h1 className='text-3xl font-bold underline mb-5'>Todo LIst</h1>

			<div
				className={
					'flex flex-col gap-4' +
					(isPlaceholderData ? ' opacity-50' : '')
				}
			>
				{todoItems?.map(todo => (
					<div
						className='border border-slate-300 rounded p-3 flex justify-between'
						key={todo.id}
					>
						<div>{todo.text}</div>
					</div>
				))}
			</div>
			<div ref={cursorRef}>
				{!hasNextPage && <div>Нет данных для загрузки</div>}
				{isFetchingNextPage && <div>Loading</div>}
			</div>
		</div>
	)
}

export const Component = TodoListPage
