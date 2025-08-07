import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DocumentsService } from '../services/DocumentsServices'
import type { CreateTemplateDto } from '../services/DocumentsServices'

export const useCreateTemplate = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateTemplateDto) =>
			DocumentsService.createTemplate(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['templates'] })
		},
	})
}
