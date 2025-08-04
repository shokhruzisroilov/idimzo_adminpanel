import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getItem, setItem, removeItem } from '../../helpers/persistanceStorage'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
	exp: number
}

const isTokenValid = (token: string | null): boolean => {
	if (!token) return false
	try {
		const decoded = jwtDecode<JwtPayload>(token)
		return decoded.exp * 1000 > Date.now()
	} catch {
		return false
	}
}

interface AuthState {
	accessToken: string | null
	refreshToken: string | null
	isAuthenticated: boolean
	isLoading: boolean
	error: string | null
}

const initialState: AuthState = {
	accessToken: getItem('accessToken'),
	refreshToken: getItem('refreshToken'),
	isAuthenticated: isTokenValid(getItem('accessToken')),
	isLoading: false,
	error: null,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		loginStart(state) {
			state.isLoading = true
			state.error = null
		},
		loginSuccess(
			state,
			action: PayloadAction<{ accessToken: string; refreshToken: string }>
		) {
			state.accessToken = action.payload.accessToken
			state.refreshToken = action.payload.refreshToken
			state.isAuthenticated = true
			state.isLoading = false
			state.error = null

			setItem('accessToken', action.payload.accessToken)
			setItem('refreshToken', action.payload.refreshToken)
		},
		loginFailure(state, action: PayloadAction<string>) {
			state.isLoading = false
			state.error = action.payload
			state.isAuthenticated = false
		},
		logout(state) {
			state.accessToken = null
			state.refreshToken = null
			state.isAuthenticated = false
			state.isLoading = false
			state.error = null

			removeItem('accessToken')
			removeItem('refreshToken')
		},
		checkAuth(state) {
			const accessToken = getItem('accessToken')
			const refreshToken = getItem('refreshToken')

			if (isTokenValid(accessToken)) {
				state.accessToken = accessToken
				state.refreshToken = refreshToken
				state.isAuthenticated = true
			} else {
				state.accessToken = null
				state.refreshToken = null
				state.isAuthenticated = false
				removeItem('accessToken')
				removeItem('refreshToken')
			}
		},
	},
})

export const { loginStart, loginSuccess, loginFailure, logout, checkAuth } =
	authSlice.actions
export default authSlice.reducer
