import React from 'react';
import Skeleton from 'react-loading-skeleton';

export default function DeliveryAddressSkeleton() {


  return (
    <div className="grid grid-cols-1">
      <Skeleton height={140} />
    </div>
  );
}
