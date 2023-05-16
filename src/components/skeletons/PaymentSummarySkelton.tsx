import React from 'react';
import Skeleton from 'react-loading-skeleton';

type Props = {};

export default function PaymentSummarySkelton({}: Props) {
  return (
    <div className="p-5">
      <Skeleton width={140} height={20} className="mb-3" />
      <Skeleton width={'100%'} height={100} className="mb-1" />
    </div>
  );
}
