"use client";

import { Skeleton } from "@/components/ui/Skeletons";

export function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
      <div className="lg:col-span-2 space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-6 p-6 bg-card rounded-[2rem] border border-border shadow-sm">
            <Skeleton className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl shrink-0" />
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-24 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="lg:col-span-1">
        <div className="bg-secondary/30 rounded-[2rem] p-6 sm:p-8 sticky top-32">
          <Skeleton className="h-8 w-1/2 mb-6" />
          <div className="space-y-4 mb-8">
            <div className="flex justify-between"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-4 w-1/4" /></div>
            <div className="flex justify-between"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-1/4" /></div>
            <div className="border-t border-border pt-4 flex justify-between">
              <Skeleton className="h-6 w-1/3" /><Skeleton className="h-6 w-1/4" />
            </div>
          </div>
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
