import TracksCard from '../../components/MusicCards/TracksCard/TracksCard';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import PlaylistsSlider from '../../components/Sliders/PlaylistsSlider/PlaylistsSlider';
import AlbumsSlider from '../../components/Sliders/AlbumsSlider/AlbumsSlider';
import PlayBar from '../../components/MusicCards/PlayBar/PlayBar';
import DiscoverPlaylistsSlider from '../../components/Sliders/DiscoverPlaylistsSlider/DiscoverPlaylistsSlider';
import PlayBarSkeleton from '../../components/MusicCards/PlayBar/PlayBarSkeleton';
import ArtistsSlider from '../../components/Sliders/ArtistsSlider/ArtistsSlider';
import { getArtistsQueryOptions } from '../../queries/artists';
import GenresSlider from '../../components/Sliders/GenresSlider/GenresSlider';
import useMediaQuery from '../../hooks/useMediaQuery';
import { genres, playlists } from '../../data';
import { chunkArray } from '../../utils/arrayUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, FreeMode, Mousewheel, Scrollbar } from 'swiper/modules';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getAllAlbumsQueryOptions } from '../../queries/albums';
import {
  getAllPrivatePlaylistsQueryOptions,
  getAllPublicPlaylistsQueryOptions,
} from '../../queries/playlists';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import PropTypes from 'prop-types';
import { getAllSongsInfiniteQueryOptions } from '../../queries/musics';
import usePlayBar from '../../hooks/usePlayBar';

export default function Home() {
  const albums = useQuery(getAllAlbumsQueryOptions());
  const artists = useQuery(getArtistsQueryOptions());
  const userPlaylists = useQuery(getAllPrivatePlaylistsQueryOptions());
  const publicPlaylists = useQuery(getAllPublicPlaylistsQueryOptions());
  const allSongs = useInfiniteQuery(getAllSongsInfiniteQueryOptions({ limit: 20 }));

  return (
    <>
      <div className="xs:flex-row xs:w-full mx-auto flex w-[90%] flex-col items-center gap-2 sm:gap-4">
        {genres.slice(0, 3).map((track) => (
          <div key={track.id} className="flex w-full justify-center">
            <TracksCard {...track} />
          </div>
        ))}
      </div>
      <div>
        <SectionHeader title="Playlists Tailored for You" />
        <PlaylistsSlider playlists={publicPlaylists.data} isLoading={publicPlaylists.isLoading} />
      </div>
      <div>
        <SectionHeader title="Your Personal Music Space" />
        <PlaylistsSlider isLoading={userPlaylists.isLoading} playlists={userPlaylists.data} />
      </div>
      <div>
        <SectionHeader title="Updates from Followed Artists" />
        <AlbumsSlider albums={albums.data} isLoading={albums.isLoading} />
      </div>
      <div className="-mt-11">
        <SectionHeader title="Daily Picks" />
        <PlayBarSlider songs={allSongs.data?.pages.flat()} isPending={allSongs.isPending} />
      </div>
      <div>
        <SectionHeader title="Artists You Follow" />
        <ArtistsSlider artists={artists.data} isLoading={artists.isLoading} />
      </div>
      <DiscoverPlaylistsSlider playlists={playlists} />
      <div>
        <SectionHeader title="Since You Enjoy Eminem" />
        <PlaylistsSlider playlists={[...playlists.slice(2, 7)].reverse()} />
      </div>
      <div>
        <SectionHeader title="Albums You Were Listening To" />
        <AlbumsSlider albums={albums.data} isLoading={albums.isLoading} />
      </div>
      <div>
        <SectionHeader title="Genres You Interested In" />
        <GenresSlider genres={genres} />
      </div>
      <div>
        <SectionHeader title="More Artists You'll Love" />
        <ArtistsSlider artists={artists.data} isLoading={artists.isLoading} />
      </div>
      <div className="-mt-8">
        <SectionHeader title="Trending Now" />
        <PlayBarSlider songs={allSongs.data?.pages.flat()} isPending={allSongs.isPending} />
      </div>
      <div>
        <SectionHeader title="Recently Seen" />
        <PlaylistsSlider isLoading={userPlaylists.isLoading} playlists={userPlaylists.data} />
      </div>
    </>
  );
}

function PlayBarSlider({ songs = [], isPending }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const itemsToRender = chunkArray(isPending ? Array(10).fill(1) : songs, isDesktop ? 5 : 3);
  const { playSingleSong } = usePlayBar();

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
        {itemsToRender.map((chunk, index) => (
          <SwiperSlide key={index} className="p-[1px] pb-11 lg:!h-auto lg:p-0 lg:pe-8">
            <div className="flex flex-col gap-4 lg:gap-6">
              {chunk.map((item, index) =>
                isPending ? (
                  <PlayBarSkeleton
                    key={index}
                    classNames="!max-w-none"
                    size={isDesktop ? 'lg' : 'md'}
                  />
                ) : (
                  <PlayBar
                    key={item.id}
                    size={isDesktop ? 'lg' : 'md'}
                    classNames="!max-w-none"
                    song={item}
                    onPlay={playSingleSong}
                  />
                )
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

PlayBarSlider.propTypes = {
  songs: PropTypes.array,
  isPending: PropTypes.bool.isRequired,
};
