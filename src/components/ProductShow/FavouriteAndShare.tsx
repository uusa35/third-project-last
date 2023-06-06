import React, { useEffect, useState } from 'react';
import Favourite from '@/appIcons/favourite.svg';
import Share from '@/appIcons/share.svg';
import SigninAddFavModal from '../modals/SigninAddFavModal';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { IsAuthenticated } from '@/redux/slices/customerSlice';
import { useAddToWishListMutation } from '@/redux/api/CustomerApi';
import { showToastMessage } from '@/redux/slices/appSettingSlice';

type Props = {
  url: string;
  product_id: string;
  existInWishlist:boolean
};
export default function FavouriteAndShare({ product_id, url ,existInWishlist=false}: Props) {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(IsAuthenticated);
  const [openSigninFavModal, setOpenSigninFavModal] = useState(false);
  const [triggerAddToWishList] = useAddToWishListMutation();

  // console.log({ isAuth });

  const handleAddRemvWishlist = async () => {
    if (isAuth) {
      if(existInWishlist){
        // remove from wishlist
      }
      else{
        // add to wishlist
        await triggerAddToWishList({ url, body: { product_id } }).then((r) => {
          if (r.data && r.data?.status) {
            dispatch(
              showToastMessage({
                content: `saved_in_wish_list`,
                type: 'success',
              })
            );
          }
        })
      }
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
