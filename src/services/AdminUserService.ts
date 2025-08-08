import API from './API'

export interface Contract {
	contractId: number
	contractTemplateName: string
}

/**
 * Query params for fetching admin users
 */
export interface AdminUserQueryParams {
	role?: string
	isPremium?: boolean
	enabled?: boolean
	search?: string
	page?: number
	size?: number
	sortBy?: string
	sortDirection?: 'ASC' | 'DESC'
}

/**
 * Single admin user object interface
 */
export interface AdminUser {
	id: number
	firstName: string
	lastName: string
	email: string
	phoneNumber: string
	profilePhotoUrl: string
	role: string
	createdAt: string
	isPremium: boolean
	enabled: boolean
	contracts: Contract[]
}

/**
 * API response for paginated admin users
 */
export interface AdminUserResponse {
	content: AdminUser[]
	page: number
	size: number
	totalElements: number
	totalPages: number
	first: boolean
	last: boolean
}

export const AdminUserServices = {
	/**
	 * Fetches all admin users with optional query params
	 */
	getAll: async (params: AdminUserQueryParams): Promise<AdminUserResponse> => {
		const response = await API.get<AdminUserResponse>('/admin/users', {
			params,
		})
		return response.data
	},

	getById: async (userId: number): Promise<AdminUser> => {
		const response = await API.get<AdminUser>(`/admin/users/${userId}`)
		return response.data
	},

	enableUser: async (userId: number): Promise<AdminUser> => {
		const response = await API.post<AdminUser>(`/admin/users/${userId}/enable`)
		return response.data
	},

	disableUser: async (userId: number): Promise<AdminUser> => {
		const response = await API.post<AdminUser>(`/admin/users/${userId}/disable`)
		return response.data
	},
}
