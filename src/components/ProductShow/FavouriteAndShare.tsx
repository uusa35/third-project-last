import React, { useEffect, useState } from 'react';
import Favourite from '@/appIcons/favourite.svg';
import ActiveFavourite from '@/appIcons/red_love.svg';
import Share from '@/appIcons/share.svg';
import SigninAddFavModal from '../modals/SigninAddFavModal';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isAuthenticated } from '@/redux/slices/customerSlice';
import {
  useAddToWishListMutation,
  useDeleteFromWishListMutation,
} from '@/redux/api/CustomerApi';
import { showToastMessage } from '@/redux/slices/appSettingSlice';

type Props = {
  url: string;
  product_id: string;
  existInWishlist: boolean;
  slug: string
};
export default function FavouriteAndShare({
  product_id,
  url,
  existInWishlist = false,
  slug
}: Props) {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(isAuthenticated);
  const [openSigninFavModal, setOpenSigninFavModal] = useState(false);
  const [triggerAddToWishList] = useAddToWishListMutation();
  const [triggerDeleteFromWishList] = useDeleteFromWishListMutation();

  console.log({ isAuth });

  const handleAddRemvWishlist = async () => {
    if (isAuth) {
      if (existInWishlist) {
        // remove from wishlist
        await triggerDeleteFromWishList({
          url,
          product_id,
        }).then((r: any) => {
          if (r.data && r.data?.status) {
            dispatch(
              showToastMessage({
                content: `deleted_from_wishlist`,
                type: 'success',
              })
            );
          }
        });
      } else {
        // add to wishlist
        await triggerAddToWishList({ url, body: { product_id } }).then(
          (r: any) => {
            if (r.data && r.data?.status) {
              dispatch(
                showToastMessage({
                  content: `saved_in_wish_list`,
                  type: 'success',
                })
              );
            }
          }
        );
      }
    } else {
      // openmodal
      setOpenSigninFavModal(true);
    }
  };
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${window.location.href}&slug=${slug}`,
          text: `${window.location.href}&slug=${slug}`,
          url: `${window.location.href}&slug=${slug}`
        });
      } else {
        console.log('Web Share API not supported');
      }
    } catch (error) {
      console.error('Sharing Error', error);
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
          {existInWishlist ? <ActiveFavourite /> : <Favourite />}
        </button>
        <button onClick={handleShare}>
          <Share />
        </button>
      </div>
    </>
  );
}
