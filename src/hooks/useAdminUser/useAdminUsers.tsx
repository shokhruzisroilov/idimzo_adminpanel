import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
	AdminUserServices,
	type AdminUserQueryParams,
} from '../../services/AdminUserService'

/**
 * Custom React Query hook to fetch admin users
 */
export const useAdminUsers = (params: AdminUserQueryParams) => {
	return useQuery({
		queryKey: ['admin-users', params],
		queryFn: () => AdminUserServices.getAll(params),
		placeholderData: keepPreviousData,
	})
}
