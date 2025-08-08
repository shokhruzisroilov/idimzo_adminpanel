import { useState } from 'react'
import { User } from 'lucide-react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../../components/ui/table'
import { PaginationComponent } from './Pagination'
import { Link } from 'react-router-dom'
import { useAdminUsers } from '../../../hooks/useAdminUser/useAdminUsers'
import avatar from '../../../assets/icons/avatar.png'
import { Skeleton } from '../../../components/ui/skeleton'

const UsersTable = () => {
	// Local state for managing the current pagination page
	const [page, setPage] = useState(0)

	// Fetch paginated list of admin users
	const { data, isLoading, error } = useAdminUsers({
		page,
		size: 10,
		sortBy: 'createdAt',
		sortDirection: 'DESC',
	})

	if (isLoading) {
		return (
			<div className='space-y-2'>
				{Array.from({ length: 10 }).map((_, idx) => (
					<div
						key={idx}
						className='flex items-center justify-between p-4 border rounded-md bg-white'
					>
						<Skeleton className='w-[40%] h-5' />
						<Skeleton className='w-[10%] h-5' />
						<Skeleton className='w-[10%] h-5' />
						<Skeleton className='w-[15%] h-5' />
						<Skeleton className='w-[15%] h-5' />
					</div>
				))}
			</div>
		)
	}

	// Show error message
	if (error) {
		return (
			<div className='text-red-600 font-medium text-center p-4 bg-red-100 rounded'>
				Xatolik yuz berdi. Qaytadan urinib ko‘ring.
			</div>
		)
	}

	return (
		<div>
			{/* Admin Users Table */}
			<Table className='bg-white'>
				<TableHeader>
					<TableRow>
						<TableHead>Foydalanuvchi</TableHead>
						<TableHead>Xizmatlar soni</TableHead>
						<TableHead>ID</TableHead>
						<TableHead className='text-right'>Holati</TableHead>
						<TableHead className='text-right'>Qo‘shilgan sana</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data?.content?.map(user => (
						<TableRow
							key={user.id}
							className='hover:bg-mainColor hover:text-white transition-colors cursor-pointer'
						>
							{/* Entire row links to the user's detail page */}
							<Link to={`/users/${user.id}`} className='contents'>
								{/* User avatar and full name */}
								<TableCell className='rounded-l-md font-medium'>
									<div className='flex items-center gap-3'>
										<img
											src={
												user.profilePhotoUrl?.trim()
													? user.profilePhotoUrl
													: avatar
											}
											alt={user.firstName}
											className='w-8 h-8 rounded-full object-cover'
										/>
										<span>
											{user.firstName} {user.lastName}
										</span>
									</div>
								</TableCell>

								{/* Placeholder value for service usage */}
								<TableCell>0</TableCell>

								{/* User ID formatted with commas */}
								<TableCell>{Number(user.id).toLocaleString()}</TableCell>

								{/* User status: Active / Inactive */}
								<TableCell className='text-right'>
									{user.enabled ? 'Faol' : 'Nofaol'}
								</TableCell>

								{/* Join date in local date format */}
								<TableCell className='text-right rounded-r-md'>
									{new Date(user.createdAt).toLocaleDateString()}
								</TableCell>
							</Link>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* Table footer: total user count and pagination */}
			<div className='flex justify-between mt-[30px]'>
				{/* Total users info */}
				<div className='flex items-center gap-3 bg-mainColor text-white px-3 rounded-lg'>
					<User />
					<p>Jami foydalanuvchilar: {data?.totalElements?.toLocaleString()}</p>
				</div>

				{/* Pagination controls */}
				<PaginationComponent
					currentPage={page}
					totalPages={data?.totalPages || 0}
					onPageChange={setPage}
				/>
			</div>
		</div>
	)
}

export default UsersTable
