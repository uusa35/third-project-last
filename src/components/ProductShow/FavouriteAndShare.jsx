import React, { useEffect, useState } from 'react';
import Favourite from '@/appIcons/favourite.svg';
import Share from '@/appIcons/share.svg';
import SigninAddFavModal from '../modals/SigninAddFavModal';
import { useAppSelector } from '@/redux/hooks';
import { IsAuthenticated } from '@/redux/slices/customerSlice';

export default function FavouriteAndShare() {
  const isAuth = useAppSelector(IsAuthenticated);
  const [openSigninFavModal, setOpenSigninFavModal] = useState(false);

  // console.log({ isAuth });

  const handleAddRemvWishlist = () => {
    if (isAuth) {
      // add to wishlist req
    } else {
      // openmodal
      setOpenSigninFavModal(true);
    }
  };
  return (
    <>
      <SigninAddFavModal
        isOpen={openSigninFavModal}
        onRequestClose={() => setOpenSigninFavModal(false)}
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
