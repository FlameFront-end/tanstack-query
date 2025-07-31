import { ReactNode } from 'react'
import { queryClient } from '@/shared/api/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastContainer } from 'react-toastify'

export const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			<ToastContainer
				position='top-center'
				autoClose={1000}
				newestOnTop
				closeOnClick
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			{children}
		</QueryClientProvider>
	)
}
