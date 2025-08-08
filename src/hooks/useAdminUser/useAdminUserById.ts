import { useQuery } from '@tanstack/react-query'
import { AdminUserServices } from '../../services/AdminUserService'

export const useAdminUserById = (userId: number) => {
	return useQuery({
		queryKey: ['admin-user', userId],
		queryFn: () => AdminUserServices.getById(userId),
		enabled: !!userId,
	})
}
