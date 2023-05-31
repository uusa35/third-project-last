import React from 'react';
import Skeleton from 'react-loading-skeleton';


export default function ProductHorizontalSkeleton() {
  return (
    <div className="py-3 px-5">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <Skeleton width={140} height={30} />
          <Skeleton width={300} height={100} />
          <div className="flex items-center">
            <div>
              <Skeleton width={140} height={40} style={{ borderRadius: '35px'}} />
            </div>
            <div className="mx-2">
            <Skeleton  width={40} height={40} circle />
            </div>
          </div>
        </div>
        <div className="flex items-center pb-4">
          <Skeleton width={100} height={100} />
        </div>
      </div>
    </div>
  )
}