import { ROUTES } from '@/shared/model/routes'
import { createBrowserRouter, redirect } from 'react-router-dom'
import { App } from './app'

export const router = createBrowserRouter([
	{
		element: <App />,
		children: [
			{
				path: ROUTES.HOME,
				loader: () => redirect(ROUTES.TODOS)
			},
			{
				path: ROUTES.TODOS,
				lazy: () => import('@/features/todo-list/todo-list.page')
			}
		]
	}
])
