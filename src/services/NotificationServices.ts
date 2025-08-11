import { db, storage } from '../firebase/firebaseConfig'
import {
	collection,
	addDoc,
	serverTimestamp,
	getDocs,
	orderBy,
	query,
	deleteDoc,
	doc,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export type LanguageCode = 'uz' | 'uzc' | 'kaa' | 'ru' | 'en'

interface NotificationFormData {
	content: string
	media: {
		file: File | null
		previewUrl: string
	}
	startDate?: Date
	endDate?: Date
}

export interface Notification {
	id: string
	content: { [key in LanguageCode]: string }
	media: { [key in LanguageCode]: string | null }
	createdAt?: Date
	startDate?: Date
	endDate?: Date
}

// 🔹 Qo‘shish
export const createNotification = async (formData: {
	[key in LanguageCode]: NotificationFormData
}) => {
	try {
		const mediaUrls: { [key in LanguageCode]: string | null } = {
			uz: null,
			uzc: null,
			kaa: null,
			ru: null,
			en: null,
		}

		// Har bir til uchun rasm yuklash
		for (const lang of Object.keys(formData) as LanguageCode[]) {
			if (formData[lang].media.file) {
				const fileRef = ref(
					storage,
					`notifications/${lang}/${Date.now()}-${
						formData[lang].media.file!.name
					}`
				)
				await uploadBytes(fileRef, formData[lang].media.file!)
				const url = await getDownloadURL(fileRef)
				mediaUrls[lang] = url
			}
		}

		// Firestore ga yozish
		await addDoc(collection(db, 'notifications'), {
			content: {
				uz: formData.uz.content,
				uzc: formData.uzc.content,
				kaa: formData.kaa.content,
				ru: formData.ru.content,
				en: formData.en.content,
			},
			images: mediaUrls,
			createdAt: serverTimestamp(),
			startDate: formData.uz.startDate,
			endDate: formData.uz.endDate,
		})

		return { success: true }
	} catch (error) {
		console.error('Bildirishnoma saqlashda xato:', error)
		return { success: false, error }
	}
}

// 🔹 Olish
export const fetchNotifications = async (): Promise<Notification[]> => {
	const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'))
	const snapshot = await getDocs(q)

	return snapshot.docs.map(docSnap => {
		const data = docSnap.data()
		return {
			id: docSnap.id,
			content: data.content as Notification['content'],
			media: data.images as Notification['media'],
			createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : undefined,
			endDate: data.endDate?.toDate ? data.endDate.toDate() : undefined,
		}
	})
}

// 🔹 O‘chirish
export const deleteNotification = async (id: string) => {
	try {
		await deleteDoc(doc(db, 'notifications', id))
		return { success: true }
	} catch (error) {
		console.error('O‘chirishda xato:', error)
		return { success: false, error }
	}
}
