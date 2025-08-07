import API from './API'

// Typelar
export interface Contract {
	templateId: number
	contractId: number
	languageCode: string
	filledContent: string
	templateName: string
	recipientDocumentId: string
	recipientBirthDate: string
}

export interface Field {
	name: string
	fieldId: string
	fieldType: string
	required: boolean
	minValue?: number
	maxValue?: number
	minLength?: number
	maxLength?: number
	pattern?: string
	options?: string[]
	orderIndex: number
	placeholder?: string
	helpText?: string
}

export interface Section {
	name: string
	orderIndex: number
	fields: Field[]
}

export interface Translation {
	languageCode: string
	content: string
	sections: Section[]
}

export interface CreateTemplateDto {
	name: string
	categoryId: number
	translations: Translation[]
}

// Service
export const DocumentsService = {
	async getContracts(): Promise<Contract[]> {
		const response = await API.get('/user/contracts')
		return response.data
	},

	async createTemplate(data: CreateTemplateDto) {
		const response = await API.post('/api/contracts/templates', data)
		return response.data
	},
}
