import TracksCard from '../../components/MusicCards/TracksCard/TracksCard';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import PlaylistsSlider from '../../components/Sliders/PlaylistsSlider/PlaylistsSlider';
import AlbumsSlider from '../../components/Sliders/AlbumsSlider/AlbumsSlider';
import DiscoverPlaylistsSlider from '../../components/Sliders/DiscoverPlaylistsSlider/DiscoverPlaylistsSlider';
import ArtistsSlider from '../../components/Sliders/ArtistsSlider/ArtistsSlider';
import { getArtistsQueryOptions } from '../../queries/artists';
import GenresSlider from '../../components/Sliders/GenresSlider/GenresSlider';
import { genres, playlists } from '../../data';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getAllAlbumsQueryOptions } from '../../queries/albums';
import {
  getAllPrivatePlaylistsQueryOptions,
  getAllPublicPlaylistsQueryOptions,
} from '../../queries/playlists';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { getAllSongsInfiniteQueryOptions } from '../../queries/musics';
import PlayBarSlider from '../../components/Sliders/PlayBarSlider/PlayBarSlider';
import { Like1 } from 'iconsax-react';
import usePlayBar from '../../hooks/usePlayBar';

export default function Home() {
  const albums = useQuery(getAllAlbumsQueryOptions());
  const artists = useQuery(getArtistsQueryOptions());
  const userPlaylists = useQuery(getAllPrivatePlaylistsQueryOptions());
  const publicPlaylists = useQuery(getAllPublicPlaylistsQueryOptions());
  const allSongs = useInfiniteQuery(getAllSongsInfiniteQueryOptions({ limit: 20 }));
  const { playSingleSong } = usePlayBar();

  return (
    <>
      <div className="xs:w-full mx-auto grid w-[90%] grid-cols-1 gap-4 min-[480px]:grid-cols-3">
        <div className="hover:outline-primary-50 flex h-[28dvw] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg bg-gradient-to-br from-[#822F6A] via-[#434EAA] to-[#005E4B] outline outline-transparent transition-colors duration-300 lg:max-h-[100px]">
          <Like1 size={50} />
          <p>Your Favorites</p>
        </div>
        {genres.slice(0, 2).map((track) => (
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
        <PlayBarSlider songs={allSongs.data?.pages.flat()} isPending={allSongs.isPending} onPlay={playSingleSong} />
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
        <PlayBarSlider songs={allSongs.data?.pages.flat()} isPending={allSongs.isPending} onPlay={playSingleSong} />
      </div>
      <div>
        <SectionHeader title="Recently Seen" />
        <PlaylistsSlider isLoading={userPlaylists.isLoading} playlists={userPlaylists.data} />
      </div>
    </>
  );
}
