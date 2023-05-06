import MainContentLayout from '@/layouts/MainContentLayout';
import React from 'react';
import GoogleMapReact from 'google-map-react';
import MapMarker from '@/appIcons/location.jpg';
import Image from 'next/image';

type Props = {};

export default function checkout({}: Props) {
  const LocationMarker = ({ icon }: any) => (
    <Image src={icon} alt="map marker" width={30} height={30} />
  );

  return (
    <MainContentLayout showBackBtnHeader={true} currentModule="checkout">
      {/* map */}
      <div className={`w-full h-[100px] mb-3 `}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: 'AIzaSyChibV0_W_OlSRJg2GjL8TWVU8CzpRHRAE',
            language: 'en',
            region: 'US',
          }}
          defaultCenter={{
            lat: 1293878789,
            lng: 76216538716,
          }}
          defaultZoom={11}
        >
          <LocationMarker lat={1293878789} lng={76216538716} icon={MapMarker} />
        </GoogleMapReact>
      </div>

      {/*  */}
    </MainContentLayout>
  );
}
