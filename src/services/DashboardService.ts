import API from './API'

export interface DashboardStats {
	userStats: {
		totalUsers: number
		growthPercentage: number
	}
	contractStats: {
		totalContracts: number
		growthPercentage: number
	}
	premiumStats: {
		totalPremiumUsers: number
		growthPercentage: number
	}
	userRegistrationChart: {
		date: string
		value: number
	}[]
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
	const response = await API.get('/admin/statistics/dashboard')
	return response.data
}
