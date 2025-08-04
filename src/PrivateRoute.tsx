import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from './redux/store'

const PrivateRoute = () => {
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated
	)

	return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />
}

export default PrivateRoute
