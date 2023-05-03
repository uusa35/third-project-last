import React from 'react';
import Favourite from '@/appIcons/favourite.svg';
import Share from '@/appIcons/share.svg';
import Link from 'next/link';
import { appLinks } from '@/constants/*';



export default function FavouriteAndShare() {
  return (
    <div className="flex justify-end items-center space-x-2">
        <Link href={appLinks.wishlist.path}>
          <Favourite />
        </Link>
        <button>
          <Share />
        </button>
      </div>
  )
}