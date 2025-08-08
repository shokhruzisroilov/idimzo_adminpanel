import API from './API'
import type { User } from '../types/User'

export const UserService = {
	async getCurrentUser(): Promise<User> {
		const res = await API.get('/users/me')
		return res.data
	},
}
