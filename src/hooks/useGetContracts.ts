import { useQuery } from '@tanstack/react-query'
import { DocumentsService } from '../services/DocumentsServices'

export const useGetContracts = () => {
	return useQuery({
		queryKey: ['contracts'],
		queryFn: DocumentsService.getContracts,
	})
}
