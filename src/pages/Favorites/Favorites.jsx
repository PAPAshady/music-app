import bannerBg from '../../assets/images/backgrounds/player-and-settings-page.png';
import SidebarPlaylist from '../../components/SidebarPlaylist/SidebarPlaylist';
import PlayBar from '../../components/MusicCards/PlayBar/PlayBar';
import SectionTitle from '../../components/SectionHeader/SectionHeader';
import AlbumsSlider from '../../components/AlbumsSlider/AlbumsSlider';
import useMediaQuery from '../../hooks/useMediaQuery';
import { songs, albums } from '../../data';
import { shuffleArray, chunkArray } from '../../utils/arrayUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Favorites() {
  const isTablet = useMediaQuery('(min-width: 480px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <div className="flex w-full items-start gap-6">
      <div className="flex grow flex-col gap-8 lg:gap-10">
        <div
          className="border-primary-300 relative overflow-hidden rounded-4xl border bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bannerBg})` }}
        >
          <div className="size-full px-4 py-10 backdrop-blur-[2px] sm:px-6 sm:py-14 lg:px-10 lg:py-16 xl:px-12 xl:py-20">
            <h3 className="text-primary-300 mb-3 text-2xl font-bold sm:text-3xl md:mb-6 lg:text-5xl">
              Favorite Music
            </h3>
            <p className="text-primary-200 sm:text-lg">
              Because Favorites Deserve Their Own Space ..
            </p>
          </div>
        </div>
        <div className="sm: flex max-h-[280px] flex-col gap-3 overflow-y-auto px-3 sm:max-h-[360px] lg:max-h-[414px] lg:gap-4">
          {songs.map((song) => (
            <PlayBar
              key={song.id}
              size={isTablet ? 'lg' : 'md'}
              {...song}
              classNames="!max-w-full"
            />
          ))}
        </div>
        <div>
          <SectionTitle title="Seggestions for you" />
          <div className="mx-auto w-[95%] xl:max-w-[940px]">
            <Swiper
              slidesPerView={1}
              modules={[Pagination]}
              spaceBetween={12}
              pagination={{ clickable: true }}
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
              className="max-w-[95dvw] lg:max-w-[calc(95dvw-86px)] xl:max-w-[calc(95dvw-410px)]"
            >
              {chunkArray(shuffleArray(songs), 2).map((songsArray, index) => (
                <SwiperSlide key={index} className="pb-11">
                  <div className="flex flex-col gap-3">
                    {songsArray.map((song) => (
                      <PlayBar
                        key={song.id}
                        {...song}
                        size={isDesktop ? 'sm' : 'md'}
                        classNames="!max-w-full p-[1px]"
                      />
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className='-mt-11'>
          <SectionTitle title="You Might Also Like" />
          <AlbumsSlider albums={albums} albumCardSize='md' albumCardStyles='!max-w-none' />
        </div>
      </div>
      <SidebarPlaylist playList={songs} />
    </div>
  );
}
