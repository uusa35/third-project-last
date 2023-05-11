import React from 'react';
import CategorySkeleton from './CategorySkeleton';
import ContactDetailsSkeleton from './ContactDetailsSkeleton';
import DeliveryAddressSkeleton from './DeliveryAddressSkeleton';
import HomePageSMSkeleton from './HomePageSMSkeleton';
import MenuItemSkeleton from './MenuItemSkeleton';
import OrderItemSkeleton from './OrderItemSkeleton';
import OrderSkeleton from './OrderSkeleton';
import PopularSearchSkeleton from './PopularSearchSkeleton';
import ProductHorizontalSkeleton from './ProductHorizontalSkeleton';
import ProductShowSkeleton from './ProductShowSkeletong';
import ProductVerticalSkeleton from './ProductVerticalSkeleton';
import ReturnPolicySkeleton from './ReturnPolicySkeleton';

type Props = {
  type: string;
  sections: number;
};

export default function ContentLoader({ type, sections }: Props) {
  let SkeletonComponent: React.FC;

  switch (type) {
    case 'ProductHorizontal':
      SkeletonComponent = ProductHorizontalSkeleton;
      break;
    case 'MenuItem':
      SkeletonComponent = MenuItemSkeleton;
      break;
    case 'Category':
      SkeletonComponent = CategorySkeleton;
      break;
    case 'ProductVertical':
      SkeletonComponent = ProductVerticalSkeleton;
      break;
    case 'DeliveryAddress':
      SkeletonComponent = DeliveryAddressSkeleton;
      break;
    case 'PopularSearch':
      SkeletonComponent = PopularSearchSkeleton;
      break;
    case 'MyOrders':
        SkeletonComponent = OrderSkeleton;
        break;
    case 'OrderITem':
        SkeletonComponent = OrderItemSkeleton;
        break;
    case 'ContactDetails':
        SkeletonComponent = ContactDetailsSkeleton;
        break;
    case 'ReturnPolicy':
        SkeletonComponent = ReturnPolicySkeleton;
        break;
    case 'Home':
        SkeletonComponent = HomePageSMSkeleton;
    break;
    case 'ProductShow':
        SkeletonComponent = ProductShowSkeleton;
    break;
    default:
      return null; 
  }

  return (
    <div>
      {Array.from({ length: sections }).map((_, index) => (
        <SkeletonComponent key={index} />
       ))}
    </div>
  );
}
