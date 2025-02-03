import SidebarPlaylist from '../../components/SidebarPlaylist/SidebarPlaylist';
import TracksCard from '../../components/MusicCards/TracksCard/TracksCard';
import PlaylistCard from '../../components/MusicCards/PlaylistCard/PlaylistCard';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import { sidebarPlaylistSongs, tracksCardsInfos, playlists } from '../../data';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';

export default function Home() {
  return (
    <div className="flex items-start gap-6">
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
          <div>
            <Swiper
              slidesPerView={1.5}
              spaceBetween={24}
              modules={[FreeMode]}
              breakpoints={{
                480: {
                  slidesPerView: 2.5,
                },
                640: {
                  slidesPerView: 3.5,
                },
                768: {
                  slidesPerView: 4.3,
                },
                1024: {
                  slidesPerView: 5,
                },
                1280: {
                  slidesPerView: 5,
                },
              }}
              className="max-w-[95dvw] lg:max-w-[calc(95dvw-86px)] xl:max-w-[calc(95dvw-450px)]"
            >
              {playlists.slice(0, 5).map((playlist) => (
                <SwiperSlide
                  key={playlist.id}
                  className="xs:max-w-[295px] p-[1px] min-[480px]:max-w-[226px] sm:max-w-[190px] md:max-w-[205px] lg:p-0 xl:max-w-[190px]"
                >
                  <PlaylistCard {...playlist} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
      <div className="hidden xl:block">
        <SidebarPlaylist playList={sidebarPlaylistSongs} />
      </div>
    </div>
  );
}
