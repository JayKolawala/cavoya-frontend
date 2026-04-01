const ProductSkeleton = ({ count = 6, columns = "default" }) => {
  const gridCols = {
    default: "grid-cols-2 md:grid-cols-3",
    "2cols": "grid-cols-2",
    "3cols": "grid-cols-2 md:grid-cols-3 xl:grid-cols-3",
    "4cols": "grid-cols-2 md:grid-cols-4",
    "full": "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
  };

  const cols = gridCols[columns] || gridCols.default;

  const SkeletonCard = () => (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="relative aspect-[3/4] bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4" />
      </div>
    </div>
  );

  return (
    <div className={`grid ${cols} gap-4 md:gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default ProductSkeleton;
