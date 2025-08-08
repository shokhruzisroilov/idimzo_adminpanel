import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminUserServices } from '../../services/AdminUserService'

export const useToggleUserStatus = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({
			userId,
			enable,
		}: {
			userId: number
			enable: boolean
		}) =>
			enable
				? AdminUserServices.enableUser(userId)
				: AdminUserServices.disableUser(userId),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['admin-user', variables.userId],
			})
		},
	})
}
