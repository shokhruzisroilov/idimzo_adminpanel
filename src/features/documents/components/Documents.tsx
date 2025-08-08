import { useState } from 'react'
import { SquarePen, Trash2 } from 'lucide-react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../../components/ui/table'
import { useNavigate } from 'react-router-dom'

const mockDocuments = [
	{
		contractId: 1,
		templateName: 'Ko‘chmas mulk shartnomasi',
		recipientBirthDate: '2025-08-01',
	},
	{
		contractId: 2,
		templateName: 'Avtomobil sotish shartnomasi',
		recipientBirthDate: '2025-07-20',
	},
	{
		contractId: 3,
		templateName: 'Ijara shartnomasi',
		recipientBirthDate: '2025-08-05',
	},
]

const Documents = () => {
	const navigate = useNavigate()

	const [searchId, setSearchId] = useState('')
	const [searchName, setSearchName] = useState('')

	const filteredDocuments = mockDocuments.filter(doc => {
		const idMatch = doc.contractId.toString().includes(searchId)
		const nameMatch = doc.templateName
			.toLowerCase()
			.includes(searchName.toLowerCase())
		return idMatch && nameMatch
	})

	return (
		<div>
			<h1 className='text-3xl mb-4 font-bold'>Hujjatlar</h1>
			<div className='w-full min-h-[80vh] bg-white rounded-xl p-5'>
				<button
					onClick={() => navigate('/documents/create')}
					className='bg-mainColor py-2 px-7 text-white rounded-md mb-10 hover:opacity-90'
				>
					Hujjat yaratish
				</button>

				{/* Search inputs */}
				<div className='flex gap-4 mb-4'>
					<input
						type='text'
						placeholder="ID bo'yicha qidirish"
						className='border border-gray-300 rounded-md p-2 w-1/4'
						value={searchId}
						onChange={e => setSearchId(e.target.value)}
					/>
					<input
						type='text'
						placeholder="Nomi bo'yicha qidirish"
						className='border border-gray-300 rounded-md p-2 w-1/4'
						value={searchName}
						onChange={e => setSearchName(e.target.value)}
					/>
				</div>

				<Table className='border-2 bg-white'>
					<TableHeader>
						<TableRow>
							<TableHead>#</TableHead>
							<TableHead>ID</TableHead>
							<TableHead>Nomi</TableHead>
							<TableHead>Yangilangan vaqti</TableHead>
							<TableHead>Tahrirlash</TableHead>
							<TableHead>O'chirish</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredDocuments.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className='text-center text-gray-500'>
									Hujjat topilmadi.
								</TableCell>
							</TableRow>
						) : (
							filteredDocuments.map((doc, index) => (
								<TableRow
									key={doc.contractId}
									className='hover:bg-mainColor hover:text-white transition-colors cursor-pointer'
								>
									<TableCell>{index + 1}</TableCell>
									<TableCell>{doc.contractId}</TableCell>
									<TableCell>{doc.templateName}</TableCell>
									<TableCell>{doc.recipientBirthDate}</TableCell>
									<TableCell>
										<SquarePen className='mx-auto' />
									</TableCell>
									<TableCell>
										<Trash2 className='mx-auto' />
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

export default Documents
