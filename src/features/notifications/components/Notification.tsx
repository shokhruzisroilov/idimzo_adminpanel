import { Plus, Trash } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DeleteModal from '../../../components/common/DeleteModal'
import {
	useNotifications,
	useDeleteNotification,
} from '../../../hooks/useNotifications'
import type { Notification as NotificationType } from '../../../services/NotificationServices'

const Notification = () => {
	const navigate = useNavigate()
	const [openDeleteModal, setOpenDeleteModal] = useState(false)
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [selectedTitle, setSelectedTitle] = useState('')

	const { data: notifications = [], isLoading, isError } = useNotifications()
	const deleteMutation = useDeleteNotification()

	const toggleModal = (id?: string, title?: string) => {
		if (id) setSelectedId(id)
		if (title) setSelectedTitle(title ?? '')
		setOpenDeleteModal(prev => !prev)
	}

	const handleDelete = () => {
		if (!selectedId) return
		deleteMutation.mutate(selectedId, {
			onSuccess: () => {
				setOpenDeleteModal(false)
				setSelectedId(null)
				setSelectedTitle('')
			},
		})
	}

	const formatDate = (d: any) => {
		if (!d) return '—'
		if (typeof d === 'object' && typeof d.toDate === 'function')
			return d.toDate().toLocaleDateString()
		if (d instanceof Date) return d.toLocaleDateString()
		if (typeof d === 'string') return new Date(d).toLocaleDateString()
		return String(d)
	}

	if (isLoading)
		return (
			<div className='p-6'>
				{[...Array(5)].map((_, i) => (
					<ul
						key={i}
						className='flex items-center border-2 border-gray-200 px-4 py-6 rounded-xl cursor-pointer mb-5 animate-pulse'
					>
						<li className='w-[3%] h-5 bg-gray-300 rounded'></li>
						<li className='w-[20%] h-12 bg-gray-300 rounded ml-4'></li>
						<li className='w-[20%] h-16 bg-gray-300 rounded ml-4'></li>
						<li className='w-[15%] h-5 bg-gray-300 rounded ml-4'></li>
						<li className='w-[15%] h-5 bg-gray-300 rounded ml-4'></li>
					</ul>
				))}
			</div>
		)
	if (isError)
		return (
			<p className='p-6 text-red-500'>
				Xatolik: bildirishnomalarni yuklab bo'lmadi
			</p>
		)

	return (
		<div className='p-6 min-h-[87vh] overflow-hidden'>
			<h1 className='text-2xl font-bold mb-6'>Bildirishnoma</h1>
			<button
				onClick={() => navigate('create-notification')}
				className='bg-mainColor flex items-center gap-2 py-2 px-6 rounded-lg text-white mb-10'
			>
				<Plus className='w-5 h-5' /> <span>Qo'shish</span>
			</button>

			{notifications.length === 0 ? (
				<p className='text-gray-500'>Hozircha bildirishnoma yo‘q.</p>
			) : (
				notifications.map((item: NotificationType, idx: number) => {
					const uzText =
						(item.content && (item.content.uz ?? item.content['uz'])) ||
						// @ts-ignore
						item.uz?.content ||
						// @ts-ignore
						item.message ||
						''

					const startDate = formatDate(item.startDate ?? item.createdAt)
					const endDate = formatDate(item.endDate)

					return (
						<ul
							key={item.id}
							className='flex items-center border-2 border-gray-200 px-4 py-6 rounded-xl cursor-pointer mb-5'
						>
							<li className='w-[3%]'>{idx + 1}</li>

							<li className='w-[20%]'>
								<h2 className='font-bold'>Message</h2>
								<span className='text-slate-400 line-clamp-2'>{uzText}</span>
							</li>

							<li className='w-[20%]'>
								{item.media?.uz ? (
									<img
										src={item.media.uz}
										alt='Bildirishnoma'
										className='w-24 h-16 object-cover rounded-md border'
									/>
								) : (
									<span className='text-slate-400'>Rasm yo‘q</span>
								)}
							</li>

							<li className='w-[15%]'>
								<h2 className='font-bold'>Chiqish sanasi</h2>
								<span className='text-slate-400'>{startDate}</span>
							</li>

							<li className='w-[15%]'>
								<h2 className='font-bold'>Tugash sanasi</h2>
								<span className='text-slate-400'>{endDate}</span>
							</li>

							<li className='ml-auto'>
								<button
									onClick={() => toggleModal(item.id, uzText)}
									className='group flex items-center gap-2 py-2 px-6 rounded-xl text-white border border-red-500 hover:bg-red-500'
								>
									<span className='text-red-500 font-bold group-hover:text-white'>
										O'chirish
									</span>
									<Trash className='w-5 h-5 text-red-500 group-hover:text-white' />
								</button>
							</li>
						</ul>
					)
				})
			)}

			<DeleteModal
				isOpen={openDeleteModal}
				onClose={() => setOpenDeleteModal(false)}
				title={selectedTitle}
				onDelete={handleDelete} // ✅ endi to‘g‘ri prop nomi
			/>
		</div>
	)
}

export default Notification
