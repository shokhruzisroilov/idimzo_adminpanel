import allusers from '@/assets/icons/allusers.png'
import contracts from '@/assets/icons/contracts.png'
import pending from '@/assets/icons/pending.png'
import trending from '@/assets/icons/trending.png'
import ChartComponent from '../../../components/ChartComponent'
import { useDashboardStats } from '../../../hooks/useDashboardStats'

const Home = () => {
	const { data, isLoading, isError } = useDashboardStats()

	if (isLoading) return <SkeletonDashboard />
	if (isError || !data) return <ErrorSkeleton />

	return (
		<div className='p-6 min-h-[87vh] overflow-hidden'>
			<h1 className='text-2xl font-bold mb-6'>Boshqaruv paneli</h1>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
				<Card
					title='Jami foydalanuvchi'
					icon={allusers}
					value={data.userStats.totalUsers}
					percentage={data.userStats.growthPercentage}
				/>
				<Card
					title='Jami shartnomalar'
					icon={contracts}
					value={data.contractStats.totalContracts}
					percentage={data.contractStats.growthPercentage}
				/>
				<Card
					title='Premium foydalanuvchilar'
					icon={pending}
					value={data.premiumStats.totalPremiumUsers}
					percentage={data.premiumStats.growthPercentage}
				/>
			</div>

			<ChartComponent />
		</div>
	)
}

// ✅ Card Component
const Card = ({
	title,
	icon,
	value,
	percentage,
}: {
	title: string
	icon: string
	value: number
	percentage: number
}) => (
	<div className='bg-white rounded-lg shadow p-6'>
		<div className='flex flex-col space-y-2'>
			<div className='flex items-center justify-between'>
				<h3 className='text-gray-500 text-sm font-medium'>{title}</h3>
				<img src={icon} alt={`${title} icon`} />
			</div>
			<div className='text-2xl font-bold text-gray-800'>{value}</div>
			<div className='flex items-center text-green-500 text-sm mt-2'>
				<img src={trending} alt='Increase' className='w-4 h-4 mr-1' />
				<span>{percentage}% Kechagi kundan boshlab</span>
			</div>
		</div>
	</div>
)

// ✅ Skeleton Loading UI
const SkeletonDashboard = () => (
	<div className='p-6 min-h-[87vh] animate-pulse'>
		<div className='h-6 bg-gray-300 rounded w-48 mb-6'></div>

		<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
			{Array.from({ length: 3 }).map((_, i) => (
				<div key={i} className='bg-white rounded-lg shadow p-6 space-y-4'>
					<div className='flex justify-between items-center'>
						<div className='h-4 bg-gray-300 rounded w-24'></div>
						<div className='w-6 h-6 bg-gray-300 rounded'></div>
					</div>
					<div className='h-6 bg-gray-300 rounded w-20'></div>
					<div className='h-4 bg-gray-200 rounded w-40'></div>
				</div>
			))}
		</div>

		<div className='bg-white h-64 rounded-lg shadow'></div>
	</div>
)

// ❌ Error UI with fallback skeleton
const ErrorSkeleton = () => (
	<div className='p-6 min-h-[87vh]'>
		<div className='text-red-600 font-medium text-lg mb-4'>
			Xatolik yuz berdi. Maʼlumotlarni yuklash imkoni bo‘lmadi.
		</div>

		<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
			{Array.from({ length: 3 }).map((_, i) => (
				<div
					key={i}
					className='bg-white rounded-lg shadow p-6 space-y-4 opacity-50'
				>
					<div className='flex justify-between items-center'>
						<div className='h-4 bg-gray-200 rounded w-24'></div>
						<div className='w-6 h-6 bg-gray-200 rounded'></div>
					</div>
					<div className='h-6 bg-gray-200 rounded w-20'></div>
					<div className='h-4 bg-gray-100 rounded w-40'></div>
				</div>
			))}
		</div>
	</div>
)

export default Home
