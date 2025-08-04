export const setItem = (key: string, value: string) => {
	try {
		if (typeof window !== 'undefined') {
			localStorage.setItem(key, value)
		}
	} catch (err) {
		console.error('localStorage error:', err)
	}
}

export const getItem = (key: string): string | null => {
	try {
		if (typeof window !== 'undefined') {
			return localStorage.getItem(key)
		}
	} catch (err) {
		console.error('localStorage error:', err)
	}
	return null
}

export const removeItem = (key: string) => {
	try {
		if (typeof window !== 'undefined') {
			localStorage.removeItem(key)
		}
	} catch (err) {
		console.error('localStorage error:', err)
	}
}
