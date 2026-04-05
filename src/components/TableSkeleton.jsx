const TableSkeleton = ({ rows = 5, columns = 6 }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex gap-4">
            {[...Array(columns)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-20" />
            ))}
          </div>
        </div>
        {/* Rows */}
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 border-b border-gray-100 flex gap-4">
            {[...Array(columns)].map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-100 rounded w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
