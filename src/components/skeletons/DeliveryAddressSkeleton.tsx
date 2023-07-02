import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

const DeliveryAddressSkeleton:FC = (): React.ReactElement => {


  return (
    <div className="grid grid-cols-1">
      <Skeleton height={140} />
    </div>
  );
}
export default DeliveryAddressSkeleton;
