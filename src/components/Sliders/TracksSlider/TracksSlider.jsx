import { useEffect, useRef } from 'react';
import PlayBar from '../../MusicCards/PlayBar/PlayBar';
import PlayBarSkeleton from '../../MusicCards/PlayBar/PlayBarSkeleton';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { chunkArray } from '../../../utils/arrayUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import PropTypes from 'prop-types';
import usePlayBar from '../../../hooks/usePlayBar';
import useLockScrollbar from '../../../hooks/useLockScrollbar';

export default function TracksSlider({ songs, isPending }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { playSingleSong } = usePlayBar();
  const { isScrollbarLocked, lockScroll, unlockScroll } = useLockScrollbar();
  const swiperRef = useRef();

  // disable swiper instance in order to now allow the user to slide when dropDownMenu is open.
  useEffect(() => {
    const swiper = swiperRef.current;
    if (isScrollbarLocked) swiper.disable();
    else swiper.enable();
  }, [isScrollbarLocked]);

  return (
    <div className="mx-auto w-[95%] xl:max-w-235">
      <Swiper
        slidesPerView={1}
        modules={[Pagination]}
        spaceBetween={12}
        pagination={{ clickable: true }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        breakpoints={{
          360: {
            slidesPerView: 1.2,
          },
          480: {
            slidesPerView: 1.5,
          },
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 2.4,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="max-w-[95dvw] lg:max-w-[calc(95dvw-86px)] xl:max-w-[calc(95dvw-428px)]"
      >
        {isPending
          ? chunkArray(Array(10).fill(), 2).map((arr, index) => (
              <SwiperSlide key={index} className="pb-11">
                <div className="flex flex-col gap-3">
                  {arr.map((_, index) => (
                    <PlayBarSkeleton
                      key={index}
                      classNames="!max-w-full"
                      size={isDesktop ? 'sm' : 'md'}
                    />
                  ))}
                </div>
              </SwiperSlide>
            ))
          : chunkArray(songs || [], 2).map((songsArray, index) => (
              <SwiperSlide key={index} className="p-px pb-11">
                <div className="flex flex-col gap-3">
                  {songsArray.map((song) => (
                    <PlayBar
                      key={song.id}
                      song={song}
                      onPlay={playSingleSong}
                      size={isDesktop ? 'sm' : 'md'}
                      classNames="!max-w-full"
                      onDropDownOpen={lockScroll}
                      onDropDownClose={unlockScroll}
                    />
                  ))}
                </div>
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}

TracksSlider.propTypes = {
  songs: PropTypes.array,
  isPending: PropTypes.bool.isRequired,
};
