import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '../../../components/ui/pagination'

type Props = {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
}

export function PaginationComponent({
	currentPage,
	totalPages,
	onPageChange,
}: Props) {
	// Create a list of visible pages (first, last, current ±1)
	const visiblePages = Array.from({ length: totalPages }, (_, i) => i).filter(
		page =>
			page === 0 || page === totalPages - 1 || Math.abs(page - currentPage) <= 1
	)

	return (
		<Pagination className='bg-white'>
			<PaginationContent>
				{/* Previous button */}
				{currentPage > 0 && (
					<PaginationItem>
						<PaginationPrevious
							href='#'
							onClick={() => onPageChange(currentPage - 1)}
						/>
					</PaginationItem>
				)}

				{/* Page numbers */}
				{visiblePages.map((page, i) => (
					<PaginationItem key={i}>
						<PaginationLink
							href='#'
							isActive={page === currentPage}
							onClick={() => onPageChange(page)}
						>
							{page + 1}
						</PaginationLink>
					</PaginationItem>
				))}

				{/* Ellipsis if there are more pages */}
				{totalPages > 5 && currentPage < totalPages - 3 && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}

				{/* Next button */}
				{currentPage < totalPages - 1 && (
					<PaginationItem>
						<PaginationNext
							href='#'
							onClick={() => onPageChange(currentPage + 1)}
						/>
					</PaginationItem>
				)}
			</PaginationContent>
		</Pagination>
	)
}
