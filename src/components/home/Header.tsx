import React from 'react';
import CustomImage from '../CustomImage';
import { imageSizes } from '@/constants/*';
import AsideHeader from '../MainAside/Header';

type Props = {
  CoverImg: string;
};

export default function Header({ CoverImg }: Props) {
  return (
    <div className="block lg:hidden lg:h-auto h-60">
      <div className="relative h-full">
        <div
          className="absolute bg-opacity-50 w-full h-full"
          style={{ backgroundColor: '#0000004D' }}
        >
          <AsideHeader />
        </div>

        <CustomImage
          src={CoverImg}
          alt={'cover image'}
          className={`object-fit w-full h-full  shadow-xl z-0 overflow-hidden`}
          width={imageSizes.xl}
          height={imageSizes.xl}
        />
      </div>
    </div>
  );
}
