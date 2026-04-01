const SingleProductSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      <div className="space-y-4">
        <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-4/6" />
        </div>
        <div className="h-12 bg-gray-200 rounded animate-pulse w-1/3" />
        <div className="flex gap-4">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-1/2" />
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-1/2" />
        </div>
      </div>
    </div>
  </div>
);

export default SingleProductSkeleton;
