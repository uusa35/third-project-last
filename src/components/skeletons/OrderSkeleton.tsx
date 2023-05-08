import React from 'react';
import Skeleton from 'react-loading-skeleton';

export default function OrderSkeleton() {
  const orderDetails = Array.from({ length: 4 }, (_, index) => (
    <Skeleton key={index} width={140} height={20} />
  ));

  return (
    <div>
      {orderDetails}
      <div className="grid grid-cols-3 gap-x-2 gap-y-2 w-[98%] mx-auto">
        <Skeleton width={140} height={40} style={{ borderRadius: '35px'}} />
        <Skeleton width={140} height={40} style={{ borderRadius: '35px'}} />
      </div>
    </div>
  );
}
