import { Outlet } from 'react-router-dom'
import { Providers } from '@/app/providers'

export const App = () => {
	return (
		<Providers>
			<div className='outlet'>
				<Outlet />
			</div>
		</Providers>
	)
}
