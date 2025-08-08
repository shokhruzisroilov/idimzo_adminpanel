import { Switch } from '../../../components/ui/switch'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToggleUserStatus } from '../../../hooks/useAdminUser/useToggleUserStatus'
import { useAdminUserById } from '../../../hooks/useAdminUser/useAdminUserById'
import avatar from '../../../assets/icons/avatar.png'

const UniqueUser = () => {
	const [activeTab, setActiveTab] = useState('malumotlar')
	const navigate = useNavigate()
	const { id } = useParams()
	const userId = Number(id)

	const { data: user, isLoading } = useAdminUserById(userId)
	const { mutate: toggleUserStatus, isPending } = useToggleUserStatus()

	if (isLoading || !user) {
		return <div className='text-center'>Yuklanmoqda...</div>
	}

	// Toggle the user's enabled status
	const handleToggle = () => {
		toggleUserStatus({ userId: user.id, enable: !user.enabled })
	}

	return (
		<div className='user-profile p-4 bg-white'>
			{/* Back button */}
			<button
				onClick={() => navigate('/users')}
				className='flex justify-center items-center gap-3 bg-mainColor text-white p-2 rounded-lg'
			>
				<ArrowLeft />
				<span>Ortga qaytish</span>
			</button>

			{/* Tab buttons */}
			<div className='tabs mb-4 border-b border-gray-200'>
				{['malumotlar', 'xizmatlar', 'xavfsizlik'].map(tab => (
					<button
						key={tab}
						className={`py-2 px-4 font-medium ${
							activeTab === tab
								? 'text-blue-600 border-b-2 border-blue-600'
								: 'text-gray-500 hover:text-gray-700'
						}`}
						onClick={() => setActiveTab(tab)}
					>
						{tab === 'malumotlar' && 'Foydalanuvchi haqida'}
						{tab === 'xizmatlar' && 'Xizmatlar'}
						{tab === 'xavfsizlik' && 'Xavfsizlik'}
					</button>
				))}
			</div>

			{/* Tab Content */}
			<div className='tab-content'>
				{/* User Info Tab */}
				{activeTab === 'malumotlar' && (
					<div className='p-4 border border-gray-200 rounded-lg space-y-2'>
						<img
							className='w-[200px] rounded-md object-cover'
							src={user.profilePhotoUrl?.trim() ? user.profilePhotoUrl : avatar}
							alt='User image'
						/>
						<h1>
							{user.firstName} {user.lastName}
						</h1>
						<h1>{user.phoneNumber}</h1>
						<h1>{user.email}</h1>
					</div>
				)}

				{/* Services Tab */}
				{activeTab === 'xizmatlar' && user.contracts?.length > 0 && (
					<div className='p-4 border border-gray-200 rounded-lg space-y-2'>
						{user.contracts.map(contract => (
							<button
								key={contract.contractId}
								className='w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-100 transition-all'
							>
								{contract.contractTemplateName}
							</button>
						))}
					</div>
				)}

				{/* Security Tab */}
				{activeTab === 'xavfsizlik' && (
					<div className='p-4 border border-gray-200 rounded-lg'>
						<div className='w-full flex justify-between items-center p-3'>
							<span>Foydalanuvchini yoqish yoki o‘chirish</span>
							<Switch
								id='user-status-toggle'
								checked={user.enabled}
								onCheckedChange={handleToggle}
								disabled={isPending}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default UniqueUser
