import React, { useState } from 'react';
import Favourite from '@/appIcons/favourite.svg';
import Share from '@/appIcons/share.svg';
import Link from 'next/link';
import { appLinks } from '@/constants/*';
import Image from 'next/image';
import SigninAddFavModal from '../modals/SigninAddFavModal';

export default function FavouriteAndShare() {
  const [isNotAvailable, setIsOpenNotAvailable] = useState(false);
  const isAuth = false;

  
  const handleAddRemvWishlist = () => {
    if (isAuth) {
      // add to wishlist req
    } else {
      // openmodal
      setIsOpenNotAvailable(true);
    }
  };
  return (
    <>
      <SigninAddFavModal
        isOpen={isNotAvailable}
        onRequestClose={() => setIsOpenNotAvailable(false)}
      />
      <div className="flex justify-end items-center space-x-2">
        <button onClick={() => handleAddRemvWishlist()}>
          <Favourite />
        </button>
        <button>
          <Share />
        </button>
      </div>
    </>
  );
}
