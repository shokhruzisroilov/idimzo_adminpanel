import { useQuery } from '@tanstack/react-query'
import { UserService } from '../services/UserService'

export const useCurrentUser = () => {
	return useQuery({
		queryKey: ['currentUser'],
		queryFn: () => UserService.getCurrentUser(),
		staleTime: 1000 * 60 * 5, // 5 minutes
	})
}
