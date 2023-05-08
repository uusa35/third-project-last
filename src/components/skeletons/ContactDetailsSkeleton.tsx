import React from 'react';
import Skeleton from 'react-loading-skeleton';

export default function ContactDetailsSkeleton() {
    const orderDetails = Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} width={200} height={20} />
      ));
  return (
      <div>
        {orderDetails}
      </div>
  );
}
