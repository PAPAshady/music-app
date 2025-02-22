import SidebarPlaylist from '../../components/SidebarPlaylist/SidebarPlaylist';
import TracksCard from '../../components/MusicCards/TracksCard/TracksCard';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import PlaylistsSlider from '../../components/Sliders/PlaylistsSlider/PlaylistsSlider';
import AlbumsSlider from '../../components/Sliders/AlbumsSlider/AlbumsSlider';
import PlayBar from '../../components/MusicCards/PlayBar/PlayBar';
import ArtistCard from '../../components/MusicCards/ArtistCard/ArtistCard';
import DiscoverPlaylistsSlider from '../../components/Sliders/DiscoverPlaylistsSlider/DiscoverPlaylistsSlider';
import ArtistsSlider from '../../components/Sliders/ArtistsSlider/ArtistsSlider';
import GenresSlider from '../../components/Sliders/GenresSlider/GenresSlider';
import useMediaQuery from '../../hooks/useMediaQuery';
import { songs, genres, playlists, albums, artists } from '../../data';
import { chunkArray, shuffleArray } from '../../utils/arrayUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, FreeMode, Mousewheel, Scrollbar, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import PropTypes from 'prop-types';

export default function Home() {
  return (
    <div className="flex items-start gap-6">
      <div className="flex grow flex-col gap-8 lg:gap-10">
        <div className="xs:flex-row xs:w-full mx-auto flex w-[90%] flex-col items-center gap-2 sm:gap-4">
          {genres.slice(0, 3).map((track) => (
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
          <AlbumsSlider albums={albums} />
        </div>
        <div className="-mt-11">
          <SectionHeader title="Daily Picks" />
          <PlayBarSlider songs={songs} />
        </div>
        <div>
          <SectionHeader title="Artists You Follow" />
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
              className="max-w-[95dvw] lg:max-w-[calc(95dvw-86px)] xl:max-w-[calc(95dvw-410px)]"
            >
              {artists.map((artist) => (
                <SwiperSlide key={artist.id} className="pb-11">
                  <ArtistCard {...artist} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <DiscoverPlaylistsSlider playlists={playlists} />
        <div>
          <SectionHeader title="Since You Enjoy Eminem" />
          <PlaylistsSlider playlists={[...playlists.slice(2, 7)].reverse()} />
        </div>
        <div>
          <SectionHeader title="Albums You Were Listening To" />
          <AlbumsSlider albums={[...albums].reverse()} />
        </div>
        <div>
          <SectionHeader title="Genres You Interested In" />
          <GenresSlider genres={genres} />
        </div>
        <div>
          <SectionHeader title="More Artists You'll Love" />
          <ArtistsSlider artists={shuffleArray(artists)} />
        </div>
        <div className="-mt-8">
          <SectionHeader title="Trending Now" />
          <PlayBarSlider songs={shuffleArray(songs)} />
        </div>
        <div>
          <SectionHeader title="Recently Seen" />
          <PlaylistsSlider playlists={shuffleArray(playlists)} />
        </div>
      </div>
      <SidebarPlaylist playList={songs} />
    </div>
  );
}

function PlayBarSlider({ songs }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
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
  );
}

PlayBarSlider.propTypes = {
  songs: PropTypes.array.isRequired,
};
