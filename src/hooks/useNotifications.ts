import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
	createNotification,
	fetchNotifications,
	deleteNotification,
	type Notification,
	type LanguageCode,
} from '../services/NotificationServices'

// 🔹 Notificationlarni olish
export function useNotifications() {
	return useQuery<Notification[]>({
		queryKey: ['notifications'],
		queryFn: fetchNotifications,
	})
}

// 🔹 Notification qo‘shish
export function useCreateNotification() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (formData: {
			[key in LanguageCode]: {
				content: string
				media: { file: File | null; previewUrl: string }
			}
		}) => createNotification(formData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
		},
	})
}

// 🔹 Notification o‘chirish
export function useDeleteNotification() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => deleteNotification(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
		},
	})
}
