import React from 'react';
import Skeleton from 'react-loading-skeleton';

export default function PolicySkeleton() {

  return (
    <div className="grid grid-cols-1 gap-x-2 gap-y-3 w-[98%] p-4 mx-auto">
        <Skeleton width={220} height={50} />
        <Skeleton height={140} />
        <Skeleton height={140} />
        <Skeleton width={220} height={50} />
        <Skeleton height={200} />
    </div>
  );
}
