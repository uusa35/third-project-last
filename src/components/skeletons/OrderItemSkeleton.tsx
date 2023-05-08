import React from 'react';
import Skeleton from 'react-loading-skeleton';

export default function OrderItemSkeleton() {

  return (
      <div className="flex justify-between">
        <div>
            <Skeleton width={200} height={20} />
            <Skeleton width={200} height={30} style={{ borderRadius: '35px'}} />
            <Skeleton width={200} height={20} />
        </div>
        <div>
            <Skeleton width={80} height={20} />
        </div>
      </div>
  );
}