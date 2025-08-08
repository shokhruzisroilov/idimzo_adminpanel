export interface User {
	id: number
	firstName: string
	lastName: string
	email: string
	phoneNumber: string
	profilePhotoUrl: string | null
	role: 'ADMIN' | 'USER'
	birthDate: string | null
	gender: 'MALE' | 'FEMALE' | null
	address: string | null
	isPremium: boolean
	premiumExpiresAt: string
	premiumDaysRemaining: number
	isPremiumExpiringSoon: boolean
	createdAt: string
}
