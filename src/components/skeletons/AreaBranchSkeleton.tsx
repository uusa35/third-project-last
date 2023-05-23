
import React from 'react';
import Skeleton from 'react-loading-skeleton';

export default function AreaBranchSkeleton() {
  return (
    <div className="px-5 py-2">
        <Skeleton containerClassName='w-full' height={50} />
    </div>
  )
}