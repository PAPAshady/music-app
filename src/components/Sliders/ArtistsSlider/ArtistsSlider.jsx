import ArtistCard from '../../MusicCards/ArtistCard/ArtistCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, FreeMode } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';
import { getArtists } from '../../../services/artists';
import ArtistCardSkeleton from '../../MusicCards/ArtistCard/ArtistCardSkeleton';
import 'swiper/css';
import 'swiper/css/pagination';

export default function ArtistsSlider() {
  const { data, isLoading } = useQuery({
    queryKey: ['artists'],
    queryFn: getArtists,
    staleTime: Infinity,
  });

  return (
    <div className="mx-auto w-[97%] max-w-[940px]">
      <Swiper
        slidesPerView={2.3}
        spaceBetween={15}
        modules={[Pagination, Autoplay, FreeMode]}
        pagination={{ enabled: false, clickable: true }}
        autoplay={{ delay: 2500, enabled: false }}
        freeMode
        breakpoints={{
          360: { slidesPerView: 2.4 },
          420: { slidesPerView: 3, spaceBetween: 10 },
          480: { slidesPerView: 3.4 },
          590: { slidesPerView: 4 },
          640: { slidesPerView: 4.5 },
          768: { slidesPerView: 5 },
          850: { slidesPerView: 5.5 },
          1024: { slidesPerView: 4.5, freeMode: false },
          1440: { slidesPerView: 5, pagination: { enabled: true }, freeMode: false },
        }}
        className="max-w-[95dvw] lg:max-w-[calc(95dvw-86px)] xl:max-w-[calc(95dvw-428px)]"
      >
        {isLoading
          ? Array(10)
              .fill(0)
              .map((_, index) => (
                <SwiperSlide key={index} className="pb-11">
                  <ArtistCardSkeleton />
                </SwiperSlide>
              ))
          : data?.artists.map((artist) => (
              <SwiperSlide key={artist.id} className="pb-11">
                <ArtistCard {...artist} />
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}
