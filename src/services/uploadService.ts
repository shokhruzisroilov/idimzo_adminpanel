import API from './API'

export const uploadFile = async (file: File): Promise<string> => {
	const formData = new FormData()
	formData.append('file', file)

	const response = await API.post('/news/upload', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})

	return response.data
}
