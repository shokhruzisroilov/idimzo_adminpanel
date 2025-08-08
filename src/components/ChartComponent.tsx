import React from 'react'
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts'
import { useDashboardStats } from '../hooks/useDashboardStats'

const ChartComponent: React.FC = () => {
	const { data, isLoading } = useDashboardStats()

	if (isLoading) return <p>Yuklanmoqda...</p>

	const chartData = data?.userRegistrationChart.map(item => ({
		name: item.date.slice(5),
		value: item.value,
	}))

	return (
		<div className='p-4 bg-white rounded-lg shadow-md'>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-lg font-semibold'>Foydalanuvchilar Statistikasi</h2>
				<select className='p-2 border rounded'>
					<option>Oxirgi 30 kun</option>
				</select>
			</div>
			<ResponsiveContainer width='100%' height={300}>
				<LineChart data={chartData}>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='name' />
					<YAxis />
					<Tooltip />
					<Legend />
					<Line
						type='monotone'
						dataKey='value'
						stroke='#8884d8'
						activeDot={{ r: 8 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}

export default ChartComponent
