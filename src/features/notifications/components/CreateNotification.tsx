import { CirclePlus, X } from 'lucide-react'
import { useState, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { uploadFile } from '../../../services/uploadService'
import {
	addDoc,
	collection,
	serverTimestamp,
	Timestamp,
} from 'firebase/firestore'
import { db } from '../../../firebase/firebaseConfig'
import { useNavigate } from 'react-router-dom'

type LanguageCode = 'uz' | 'uzc' | 'kaa' | 'ru' | 'en'

interface NotificationFormData {
	content: string
	imageUrl: string
}

const CreateNotification = () => {
	const navigate = useNavigate()

	const [formData, setFormData] = useState<{
		[key in LanguageCode]: NotificationFormData
	}>({
		uz: { content: '', imageUrl: '' },
		uzc: { content: '', imageUrl: '' },
		kaa: { content: '', imageUrl: '' },
		ru: { content: '', imageUrl: '' },
		en: { content: '', imageUrl: '' },
	})

	const [startDate, setStartDate] = useState<string>('')
	const [endDate, setEndDate] = useState<string>('')
	const [loadingLang, setLoadingLang] = useState<LanguageCode | null>(null)
	const [loadingSave, setLoadingSave] = useState(false)
	const [errors, setErrors] = useState<string[]>([])

	const fileInputRefs: Record<
		LanguageCode,
		React.RefObject<HTMLInputElement>
	> = {
		uz: useRef(null),
		uzc: useRef(null),
		kaa: useRef(null),
		ru: useRef(null),
		en: useRef(null),
	}

	const languages: { code: LanguageCode; label: string }[] = [
		{ code: 'uz', label: "O'zbekcha Message" },
		{ code: 'uzc', label: 'Узбекский Message' },
		{ code: 'kaa', label: 'Qaraqalpaq Message' },
		{ code: 'ru', label: 'Русский Message' },
		{ code: 'en', label: 'English Message' },
	]

	// Fayl tanlanganda API'ga yuboradi va qaytgan linkni saqlaydi
	const handleFileChange = async (
		e: ChangeEvent<HTMLInputElement>,
		lang: LanguageCode
	) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			try {
				setLoadingLang(lang)
				const uploadedUrl = await uploadFile(file) // API return link
				setFormData(prev => ({
					...prev,
					[lang]: { ...prev[lang], imageUrl: uploadedUrl },
				}))
			} catch (error) {
				console.error('File upload failed', error)
				// optional: push an error message
			} finally {
				setLoadingLang(null)
			}
		}
	}

	const handleRemoveFile = (lang: LanguageCode) => {
		setFormData(prev => ({
			...prev,
			[lang]: { ...prev[lang], imageUrl: '' },
		}))
		if (fileInputRefs[lang].current) {
			fileInputRefs[lang].current!.value = ''
		}
	}

	// Validatsiya: kamida uz matn va sanalar kerak
	const validateForm = () => {
		const newErrors: string[] = []
		if (!startDate) newErrors.push('Boshlanish sanasi tanlanmagan')
		if (!endDate) newErrors.push('Tugash sanasi tanlanmagan')

		if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
			newErrors.push('Boshlanish sanasi tugash sanasidan oldin bo‘lishi kerak')
		}

		// faqat uz majburiy — agar boshqa tillar ham majburiy bo'lsa bu qatorlarni o'zgartiring
		if (!formData.uz.content.trim())
			newErrors.push("O'zbekcha matn kiritilishi shart")
		// agar rasm ham uz uchun majburiy bo'lsa
		// if (!formData.uz.imageUrl) newErrors.push("O'zbekcha uchun rasm yuklanmagan")

		setErrors(newErrors)
		return newErrors.length === 0
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validateForm()) return

		setLoadingSave(true)
		try {
			await addDoc(collection(db, 'notifications'), {
				content: {
					uz: formData.uz.content,
					uzc: formData.uzc.content,
					kaa: formData.kaa.content,
					ru: formData.ru.content,
					en: formData.en.content,
				},
				images: {
					uz: formData.uz.imageUrl || null,
					uzc: formData.uzc.imageUrl || null,
					kaa: formData.kaa.imageUrl || null,
					ru: formData.ru.imageUrl || null,
					en: formData.en.imageUrl || null,
				},
				startDate: Timestamp.fromDate(new Date(startDate)),
				endDate: Timestamp.fromDate(new Date(endDate)),
				createdAt: serverTimestamp(),
			})
			// muvaffaqiyatli bo'lsa redirect
			navigate('/notification')
		} catch (error) {
			console.error('Error adding notification: ', error)
			setErrors(['Bildirishnoma saqlashda xatolik yuz berdi'])
		} finally {
			setLoadingSave(false)
		}
	}

	return (
		<div className='p-6 min-h-[87vh] overflow-hidden'>
			<h1 className='text-2xl font-bold mb-6'>Bildirishnoma / Qo'shish</h1>

			{errors.length > 0 && (
				<div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>
					<ul className='list-disc list-inside'>
						{errors.map((err, idx) => (
							<li key={idx}>{err}</li>
						))}
					</ul>
				</div>
			)}

			<form onSubmit={handleSubmit}>
				{/* Sana tanlash */}
				<div className='mb-6 flex gap-6'>
					<div>
						<label className='block mb-1 font-medium'>Boshlanish sanasi</label>
						<input
							type='datetime-local'
							value={startDate}
							onChange={e => setStartDate(e.target.value)}
							className='border rounded px-3 py-2'
						/>
					</div>
					<div>
						<label className='block mb-1 font-medium'>Tugash sanasi</label>
						<input
							type='datetime-local'
							value={endDate}
							onChange={e => setEndDate(e.target.value)}
							className='border rounded px-3 py-2'
						/>
					</div>
				</div>

				{/* Tillar bo'yicha textarea va rasm */}
				{languages.map(lang => (
					<div key={lang.code} className='mb-8'>
						<h2 className='mb-2 text-lg font-semibold'>{lang.label}</h2>
						<div className='flex gap-4 items-start'>
							{/* Text area qismi — dizaynni saqlab turadigan konteyner */}
							<div className='w-[60%] rounded-lg border border-gray-300 bg-white'>
								<textarea
									value={formData[lang.code].content}
									onChange={e =>
										setFormData(prev => ({
											...prev,
											[lang.code]: {
												...prev[lang.code],
												content: e.target.value,
											},
										}))
									}
									placeholder='Xabarni yozing...'
									className='w-full h-[227px] p-3 resize-none outline-none'
								/>
							</div>

							{/* Rasm qismi */}
							<div className='w-[20%]'>
								<p className='mb-2 font-medium'>
									375x816 (WEBP, PNG, JPG)(10MB)*
								</p>
								<input
									type='file'
									ref={fileInputRefs[lang.code]}
									onChange={e => handleFileChange(e, lang.code)}
									accept='.webp,.png,.jpg,.jpeg'
									className='hidden'
								/>
								<button
									type='button'
									onClick={() => fileInputRefs[lang.code].current?.click()}
									className='w-[100px] h-[100px] bg-gray-200 rounded-lg border-dotted border-2 flex items-center justify-center relative overflow-hidden'
								>
									{loadingLang === lang.code ? (
										<span className='text-sm text-gray-500'>
											Yuklanmoqda...
										</span>
									) : formData[lang.code].imageUrl ? (
										<div className='relative w-full h-full'>
											<img
												src={formData[lang.code].imageUrl}
												alt='Preview'
												className='w-full h-full object-cover'
											/>
											<button
												type='button'
												onClick={e => {
													e.stopPropagation()
													handleRemoveFile(lang.code)
												}}
												className='absolute -top-0 -right-0 bg-red-500 text-white rounded-full p-1'
											>
												<X className='w-3 h-3' />
											</button>
										</div>
									) : (
										<CirclePlus className='w-6 h-6 text-gray-500' />
									)}
								</button>
							</div>
						</div>
					</div>
				))}

				<div className='mt-6'>
					<button
						type='submit'
						disabled={loadingSave}
						className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
					>
						{loadingSave ? 'Saqlanmoqda...' : 'Bildirishnomani Saqlash'}
					</button>
				</div>
			</form>
		</div>
	)
}

export default CreateNotification
