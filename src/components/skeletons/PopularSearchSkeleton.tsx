import React from 'react';
import Skeleton from 'react-loading-skeleton';

export default function PopularSearchSkeleton() {
  return (
    <div className="grid grid-cols-3 gap--3 w-[98%] mx-auto">
        <Skeleton width={140} height={50} style={{ borderRadius: '35px' }} />
        <Skeleton width={140} height={50} style={{ borderRadius: '35px' }} />
        <Skeleton width={140} height={50} style={{ borderRadius: '35px' }} />
    </div>
  );
}
