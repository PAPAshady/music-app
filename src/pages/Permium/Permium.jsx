import SidebarPlaylist from '../../components/SidebarPlaylist/SidebarPlaylist';
import PermiumCard from '../../components/PermiumCard/PermiumCard';
import useMediaQuery from '../../hooks/useMediaQuery';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, FreeMode } from 'swiper/modules';
import { songs } from '../../data';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Permium() {
  const isTablet = useMediaQuery('(min-width: 768px)');

  const permiumCards = [
    {
      id: 1,
      title: 'Your Musical Journey Awaits',
      permiumType: 'Annual Subscription',
      price: 99.99,
    },
    { id: 2, title: 'Unlock the Rhythm', permiumType: 'Monthly Subscription', price: 9.99 },
    { id: 3, title: 'Amplify Your Tunes', permiumType: 'Quarterly Subscription', price: 24.99 },
  ];

  return (
    <div className="flex w-full items-start gap-6">
      <div className="flex grow flex-col gap-8 lg:gap-10">
        <div className="mb-4 pt-4 text-center">
          <h4 className="text-white-200 mb-5 text-3xl font-semibold sm:text-4xl lg:text-4xl 2xl:!text-5xl">
            Unlock Your Music Potential
          </h4>
          <p className="text-primary-200 text-lg sm:text-xl lg:text-2xl 2xl:!text-[32px]">
            Enjoy Unlimited Streaming with Premium Access
          </p>
        </div>
        {isTablet ? (
          <div className="flex justify-center gap-4 min-[992px]:gap-8 xl:gap-4 2xl:!gap-5">
            {permiumCards.map((card) => (
              <PermiumCard key={card.id} {...card} />
            ))}
          </div>
        ) : (
          <Swiper
            slidesPerView="auto"
            modules={[Pagination, FreeMode]}
            pagination={{ clickable: true }}
            freeMode
            spaceBetween={24}
            className="max-w-[95dvw]"
          >
            {permiumCards.map((card) => (
              <SwiperSlide key={card.id} className="!w-auto pb-16">
                <PermiumCard {...card} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      <SidebarPlaylist playList={songs} />
    </div>
  );
}
