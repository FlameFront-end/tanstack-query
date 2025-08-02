import { useTodoList } from '@/features/todo-list/use-todo-list'

export const TodoListPage = () => {
	const { todoItems, isLoading, error, cursor } = useTodoList()

	if (isLoading) {
		return <div>Loading</div>
	}

	if (error) {
		return <div>error: {JSON.stringify(error)}</div>
	}

	return (
		<div className='p-5 mx-auto max-w-[1200px] mt-10'>
			<h1 className='text-3xl font-bold underline mb-5'>Todo LIst</h1>

			<div className={'flex flex-col gap-4'}>
				{todoItems?.map(todo => (
					<div
						className='border border-slate-300 rounded p-3 flex justify-between'
						key={todo.id}
					>
						<div>{todo.text}</div>
					</div>
				))}
			</div>
			{cursor}
		</div>
	)
}

export const Component = TodoListPage
