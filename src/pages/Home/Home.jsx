import SectionHeader from '../../components/SectionHeader/SectionHeader';
import PlaylistsSlider from '../../components/Sliders/PlaylistsSlider/PlaylistsSlider';
import AlbumsSlider from '../../components/Sliders/AlbumsSlider/AlbumsSlider';
import DiscoverPlaylistsSlider from '../../components/Sliders/DiscoverPlaylistsSlider/DiscoverPlaylistsSlider';
import ArtistsSlider from '../../components/Sliders/ArtistsSlider/ArtistsSlider';
import { getArtistsQueryOptions } from '../../queries/artists';
import GenresSlider from '../../components/Sliders/GenresSlider/GenresSlider';
import { genres, playlists } from '../../data';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getAllAlbumsQueryOptions,
  getTrendingAlbumsQueryOptions,
  getRecommendedAlbumsQueryOptions,
} from '../../queries/albums';
import {
  getAllPrivatePlaylistsQueryOptions,
  getTrendingPlaylistsQueryOptions,
  getRecommendedPlaylistsQueryOptions,
} from '../../queries/playlists';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { getAllSongsInfiniteQueryOptions } from '../../queries/musics';
import PlayBarSlider from '../../components/Sliders/PlayBarSlider/PlayBarSlider';
import usePlayBar from '../../hooks/usePlayBar';

export default function Home() {
  const albums = useQuery(getAllAlbumsQueryOptions());
  const artists = useQuery(getArtistsQueryOptions());
  const userPlaylists = useQuery(getAllPrivatePlaylistsQueryOptions());
  const allSongs = useInfiniteQuery(getAllSongsInfiniteQueryOptions({ limit: 20 }));
  const { playSingleSong } = usePlayBar();
  const userHasPlaylists = userPlaylists.data?.length > 0;
  const { data: trendingPlaylists, isPending: isTrendingPlaylistsPending } = useQuery({
    ...getTrendingPlaylistsQueryOptions(),
    enabled: !userHasPlaylists,
  });
  const { data: recommendedPlaylists, isPending: isRecommendedPlaylistsPending } = useQuery(
    getRecommendedPlaylistsQueryOptions()
  );
  const { data: recommendedAlbums, isPending: isRecommendedAlbumsPending } = useQuery(
    getRecommendedAlbumsQueryOptions()
  );
  const { data: trendingAlbums, isPending: isTrendingAlbumsPending } = useQuery({
    ...getTrendingAlbumsQueryOptions(),
    enabled: !recommendedAlbums?.length,
  });

  return (
    <>
      <div>
        <SectionHeader
          isPending={userPlaylists.isPending}
          title={
            userHasPlaylists ? 'Your Personal Music Space' : 'Trending playlists you might like'
          }
        />
        <PlaylistsSlider
          isLoading={userPlaylists.isPending || isTrendingPlaylistsPending}
          playlists={
            userHasPlaylists
              ? [{ id: 0, type: 'favorite-songs' }, ...userPlaylists.data]
              : trendingPlaylists
          }
        />
      </div>

      {(isRecommendedPlaylistsPending || !!recommendedPlaylists?.length) && (
        <div>
          <SectionHeader
            title="Playlists Tailored for You"
            isPending={isRecommendedPlaylistsPending}
          />
          <PlaylistsSlider
            playlists={recommendedPlaylists}
            isLoading={isRecommendedPlaylistsPending}
          />
        </div>
      )}

      <div>
        <SectionHeader
          title={recommendedAlbums?.length ? 'Hot albums for you' : 'Trending albums of this week'}
          isPending={isRecommendedAlbumsPending}
        />
        <AlbumsSlider
          albums={recommendedAlbums?.length ? recommendedAlbums : trendingAlbums}
          isLoading={isRecommendedAlbumsPending || isTrendingAlbumsPending}
        />
      </div>

      <div className="-mt-11">
        <SectionHeader title="Daily Picks" />
        <PlayBarSlider
          songs={allSongs.data?.pages.flat()}
          isPending={allSongs.isPending}
          onPlay={playSingleSong}
        />
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
        <PlayBarSlider
          songs={allSongs.data?.pages.flat()}
          isPending={allSongs.isPending}
          onPlay={playSingleSong}
        />
      </div>
      <div>
        <SectionHeader title="Recently Seen" />
        <PlaylistsSlider isLoading={userPlaylists.isLoading} playlists={userPlaylists.data} />
      </div>
    </>
  );
}
