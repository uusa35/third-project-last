import React from 'react';
import Skeleton from 'react-loading-skeleton';

export default function CategorySkeleton() {
  const skeletonContent = (
    <div className="py-2">
      <Skeleton height={140} />
      <Skeleton width={180} height={30} />
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-2 w-[98%] mx-auto">
      {skeletonContent}
      {skeletonContent}
    </div>
  );
}
