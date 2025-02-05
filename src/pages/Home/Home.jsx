import SidebarPlaylist from '../../components/SidebarPlaylist/SidebarPlaylist';
import TracksCard from '../../components/MusicCards/TracksCard/TracksCard';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import PlaylistsSlider from '../../components/PlaylistsSlider/PlaylistsSlider';
import AlbumCard from '../../components/MusicCards/AlbumCard/AlbumCard';
import PlayBar from '../../components/MusicCards/PlayBar/PlayBar';
import useMediaQuery from '../../hooks/useMediaQuery';
import { songs, tracksCardsInfos, playlists, albums } from '../../data';
import { chunkArray } from '../../utils/arrayUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, FreeMode, Mousewheel, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default function Home() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <div className="flex items-start gap-6 pb-14">
      <div className="flex grow flex-col gap-8 lg:gap-10">
        <div className="xs:flex-row xs:w-full mx-auto flex w-[90%] flex-col items-center gap-2 sm:gap-4">
          {tracksCardsInfos.map((track) => (
            <div key={track.id} className="flex w-full justify-center">
              <TracksCard {...track} />
            </div>
          ))}
        </div>
        <div>
          <SectionHeader title="Playlists Tailored for You" />
          <PlaylistsSlider playlists={playlists.slice(0, 5)} />
        </div>
        <div>
          <SectionHeader title="Your Personal Music Space" />
          <PlaylistsSlider playlists={playlists.slice(5, 10)} />
        </div>
        <div>
          <SectionHeader title="Updates from Followed Artists" />
          <div className="mx-auto w-[95%] max-w-[940px]">
            <Swiper
              slidesPerView={1}
              spaceBetween={24}
              modules={[Pagination]}
              pagination={{ clickable: true }}
              className="max-w-[95dvw] lg:max-w-[calc(95dvw-86px)] xl:max-w-[calc(95dvw-410px)]"
              breakpoints={{
                500: {
                  slidesPerView: 1.2,
                },
                570: {
                  slidesPerView: 1.4,
                },
                768: {
                  slidesPerView: 2,
                },
              }}
            >
              {chunkArray(albums, 3).map((albumsArray, index) => (
                <SwiperSlide key={index} className="p-[1px] pb-11">
                  <div className="flex flex-col gap-4">
                    {albumsArray.map((album) => (
                      <AlbumCard key={album.id} size="lg" {...album} />
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="-mt-11">
          <SectionHeader title="Daily Picks" />

          <div className="mx-auto w-[95%] max-w-[1050px]">
            <Swiper
              spaceBetween={24}
              slidesPerView={1}
              modules={[Pagination, FreeMode, Mousewheel, Scrollbar]}
              pagination={{ clickable: true, enabled: isDesktop ? false : true }}
              className="max-w-[95dvw] lg:max-h-[450px]"
              scrollbar={{ enabled: false, draggable: true }}
              breakpoints={{
                480: {
                  slidesPerView: 1.2,
                },
                570: {
                  slidesPerView: 1.4,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
                1024: {
                  direction: 'vertical',
                  slidesPerView: 'auto',
                  spaceBetween: 24,
                  freeMode: true,
                  mousewheel: { enabled: true, forceToAxis: true },
                  scrollbar: { enabled: true },
                },
              }}
            >
              {/* Divide the songs array into chunks of 3 or 5 (depnends on screen size) and map over each chunk */}
              {chunkArray(songs.slice(0, 9), isDesktop ? 5 : 3).map((songsArray, index) => (
                <SwiperSlide key={index} className="p-[1px] pb-11 lg:!h-auto lg:p-0 lg:pe-8">
                  <div className="flex flex-col gap-4 lg:gap-6">
                    {songsArray.map((song) => (
                      <PlayBar
                        key={song.id}
                        size={isDesktop ? 'lg' : 'md'}
                        classNames="!max-w-none"
                        {...song}
                      />
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
      <div className="hidden xl:block">
        <SidebarPlaylist playList={songs} />
      </div>
    </div>
  );
}
