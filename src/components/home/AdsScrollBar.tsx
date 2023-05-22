import React from 'react';
import CustomImage from '../CustomImage';
import { isEmpty } from 'lodash';

type Props = {
  slider: string[];
};

export default function AdsScrollBar({ slider = [] }: Props) {
  return (
    <>
      {!isEmpty(slider) && (
        <div className="flex items-center gap-x-3 h-24 mb-5 px-4 overflow-x-scroll scrollbar-hide">
          {slider.map((img) => {
            return (
              <>
                <CustomImage src={img} alt="ads" className="h-full w-40" />
                <CustomImage src={img} alt="ads" className="h-full w-40" />
                <CustomImage src={img} alt="ads" className="h-full w-40" />
                <CustomImage src={img} alt="ads" className="h-full w-40" />
                <CustomImage src={img} alt="ads" className="h-full w-40" />
              </>
            );
          })}
        </div>
      )}
    </>
  );
}
