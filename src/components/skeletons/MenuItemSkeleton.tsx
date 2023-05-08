
import React from 'react';
import Skeleton from 'react-loading-skeleton';

export default function MenuItemSkeleton() {
  return (
    <div className="p-1">
        <Skeleton className="border-t-[1px] border-slate-200 block px-4 py-2 mx-auto" width={'100%'} height={50} />
    </div>
  )
}