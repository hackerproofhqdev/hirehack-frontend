interface PaginationProps {
    page: number
    totalPages: number
    setPage: (page: number) => void
  }
  
  export default function Pagination({ page, totalPages, setPage }: PaginationProps) {
    const handlePrevPage = () => {
      if (page > 1) {
        setPage(page - 1)
      }
    }
  
    const handleNextPage = () => {
      if (page < totalPages) {
        setPage(page + 1)
      }
    }
  
    return (
      <div className="flex items-center justify-center mt-8 gap-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-400">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    )
  }
  
  