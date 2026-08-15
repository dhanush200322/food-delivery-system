export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded-xl ${className}`} />
  );
}

export function CategorySkeleton() {
  return (
    <div className="group block">
      <Skeleton className="relative aspect-square rounded-2xl mb-3" />
      <Skeleton className="h-5 w-24 rounded" />
    </div>
  );
}

export function CategoriesSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <CategorySkeleton key={i} />
      ))}
    </div>
  );
}

export function RestaurantSkeleton() {
  return (
    <div className="flex flex-col bg-card rounded-3xl overflow-hidden shadow-sm border border-border h-full">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 flex flex-col flex-grow">
        <Skeleton className="h-6 w-3/4 mb-2 rounded" />
        <Skeleton className="h-4 w-1/2 mb-6 rounded" />
        <div className="mt-auto flex items-center gap-4">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function RestaurantsSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <RestaurantSkeleton key={i} />
      ))}
    </div>
  );
}

export function FoodSkeleton() {
  return (
    <div className="bg-card rounded-[2rem] p-4 shadow-sm border border-border h-full flex flex-col">
      <div className="flex justify-center -mt-12 mb-4">
        <Skeleton className="h-48 w-48 rounded-full border-4 border-background" />
      </div>
      <div className="text-center flex-grow flex flex-col items-center">
        <Skeleton className="h-3 w-16 mb-2 rounded" />
        <Skeleton className="h-6 w-3/4 mb-3 rounded" />
        <Skeleton className="h-4 w-24 mb-6 rounded" />
        <div className="mt-auto flex items-center justify-between w-full pt-4">
          <Skeleton className="h-8 w-16 rounded" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function FoodsSkeletonGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <FoodSkeleton key={i} />
      ))}
    </div>
  );
}

export function PromotionSkeleton() {
  return (
    <Skeleton className="w-full min-h-[400px] rounded-3xl" />
  );
}
