import axios from 'axios'
import { getItem, setItem } from '../helpers/persistanceStorage'
import AuthService from './AuthService'
import { jwtDecode } from 'jwt-decode'
import { store } from '../redux/store'
import { logout } from '../redux/slices/authSlice'

declare module 'axios' {
	interface AxiosRequestConfig {
		_retry?: boolean
	}
}

const API = axios.create({
	baseURL: 'https://api.idimzo.uz/api',
})

API.interceptors.request.use(config => {
	const token = getItem('accessToken')
	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

let isRefreshing = false
let failedQueue: {
	resolve: (token: string) => void
	reject: (err: unknown) => void
}[] = []

const processQueue = (error: unknown, token: string | null = null) => {
	failedQueue.forEach(prom => {
		if (error) prom.reject(error)
		else if (token) prom.resolve(token)
	})
	failedQueue = []
}

const isTokenExpired = (token: string): boolean => {
	try {
		const decoded: any = jwtDecode(token)
		return decoded.exp * 1000 < Date.now()
	} catch {
		return true
	}
}

API.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config

		if (error.response?.status === 401 && !originalRequest._retry) {
			const refreshToken = getItem('refreshToken')
			if (!refreshToken || isTokenExpired(refreshToken)) {
				store.dispatch(logout())
				return Promise.reject(error)
			}

			originalRequest._retry = true

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject })
				})
					.then(token => {
						originalRequest.headers['Authorization'] = `Bearer ${token}`
						return API(originalRequest)
					})
					.catch(err => Promise.reject(err))
			}

			isRefreshing = true

			try {
				const res = await AuthService.refresh(refreshToken)
				setItem('accessToken', res.accessToken)
				setItem('refreshToken', res.refreshToken)
				processQueue(null, res.accessToken)
				originalRequest.headers['Authorization'] = `Bearer ${res.accessToken}`
				return API(originalRequest)
			} catch (err) {
				processQueue(err, null)
				store.dispatch(logout())
				return Promise.reject(err)
			} finally {
				isRefreshing = false
			}
		}

		return Promise.reject(error)
	}
)

export default API
