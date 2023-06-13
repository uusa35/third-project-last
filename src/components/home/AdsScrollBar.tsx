import React, { FC } from 'react';
import CustomImage from '../CustomImage';
import { isEmpty } from 'lodash';
import Slider from 'react-slick';

type Props = {
  slider: string[];
};

const AdsScrollBar: FC<Props> = ({ slider = [] }) => {
  var settings = {
    // dots: true,
    // className: 'slider variable-width flex',
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: 'linear',
    pauseOnHover: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    // variableWidth: true,
    centerMode: true,
    centerPadding: '70px 0px 0px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          //   infinite: true,
          //   dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          //   initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="px-4 mb-4">
      {!isEmpty(slider) && (
        <Slider {...settings}>
          {slider.map((img) => (
            <CustomImage src={img} alt="ads" className="h-full w-40" />
          ))}
        </Slider>
      )}
    </div>
  );
};
export default AdsScrollBar;
