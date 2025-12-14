import SectionHeader from '../../components/SectionHeader/SectionHeader';
import PlaylistsSlider from '../../components/Sliders/PlaylistsSlider/PlaylistsSlider';
import AlbumsSlider from '../../components/Sliders/AlbumsSlider/AlbumsSlider';
import DiscoverPlaylistsSlider from '../../components/Sliders/DiscoverPlaylistsSlider/DiscoverPlaylistsSlider';
import ArtistsSlider from '../../components/Sliders/ArtistsSlider/ArtistsSlider';
import { getTrendingArtistsQueryOptions } from '../../queries/artists';
import GenresSlider from '../../components/Sliders/GenresSlider/GenresSlider';
import { playlists } from '../../data';
import { useQuery } from '@tanstack/react-query';
import {
  getTrendingAlbumsQueryOptions,
  getRecommendedAlbumsQueryOptions,
  getRecentAlbumsQueryOptions,
  getAlbumsByGenreIdQueryOptions,
} from '../../queries/albums';
import {
  getAllPrivatePlaylistsQueryOptions,
  getTrendingPlaylistsQueryOptions,
  getRecommendedPlaylistsQueryOptions,
  getPlaylistsByGenreQueryOptions,
} from '../../queries/playlists';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import PlayBarSlider from '../../components/Sliders/PlayBarSlider/PlayBarSlider';
import {
  getRecommendedSongsQueryOptions,
  getTrendingSongsQueryOptions,
  getRecentSongsQueryOptions,
} from '../../queries/songs';
import { getUserTopGenresQueryOptions } from '../../queries/genres';
import usePlayBar from '../../hooks/usePlayBar';

export default function Home() {
  const { data: trendingArtists, isPending: isTrendingArtistsPending } = useQuery(
    getTrendingArtistsQueryOptions()
  );
  const { data: userPlaylists, isPending: isUserPlaylistsPending } = useQuery(
    getAllPrivatePlaylistsQueryOptions()
  );
  const { data: recommendedPlaylists, isPending: isRecommendedPlaylistsPending } = useQuery(
    getRecommendedPlaylistsQueryOptions()
  );
  const { data: recommendedAlbums, isPending: isRecommendedAlbumsPending } = useQuery(
    getRecommendedAlbumsQueryOptions()
  );
  const { data: recommendedSongs, isPending: isRecommendedSongsPending } = useQuery(
    getRecommendedSongsQueryOptions()
  );
  const { data: recentSongs, isPending: isRecentSongsPending } = useQuery(
    getRecentSongsQueryOptions()
  );
  const { data: recentAlbums, isPending: isRecentAlbumsPending } = useQuery(
    getRecentAlbumsQueryOptions()
  );
  const showUserPlaylists = !!userPlaylists?.length;
  const showRecommendedPlaylists = !!recommendedPlaylists?.length;
  const showRecommendedAlbums = !!recommendedAlbums?.length;
  const showRecommendedSongs = recommendedSongs?.length > 5;
  const showRecentSongs = recentSongs?.length > 5;
  const showRecentAlbums = !!recentAlbums?.length;
  const { data: trendingPlaylists, isLoading: isTrendingPlaylistsPending } = useQuery({
    ...getTrendingPlaylistsQueryOptions(),
    enabled: !showUserPlaylists,
  });
  const { data: trendingAlbums, isLoading: isTrendingAlbumsPending } = useQuery({
    ...getTrendingAlbumsQueryOptions(),
    enabled: !showRecommendedAlbums,
  });
  const { data: trendingSongs, isLoading: isTrendingSongsPending } = useQuery({
    ...getTrendingSongsQueryOptions(),
    enabled: !showRecommendedSongs,
  });
  const { data: hipHopAlbums, isLoading: isHopHopAlbumsLoading } = useQuery({
    ...getAlbumsByGenreIdQueryOptions('22cebc0a-01a0-4f3d-a6b9-45039290936c'), // get hip-hop albums
    enabled: !showRecentAlbums,
  });
  const topPlaylistsTitle = showUserPlaylists
    ? 'Your Personal Music Space'
    : 'Trending playlists you might like';
  const albumsTitle = showRecommendedAlbums ? 'Hot albums for you' : 'Trending albums of this week';
  const { data: userTopGenres, isPending: isUserTopGenresPending } = useQuery(
    getUserTopGenresQueryOptions()
  );
  const userMostLikedGenre = userTopGenres?.[0];
  const { data: recommendedPlaylistsByGenre, isPending: isRecommendedPlaylistsByGenrePending } =
    useQuery(getPlaylistsByGenreQueryOptions(userMostLikedGenre?.id));
  const showRecommendedPlaylistsByGenre = recommendedPlaylistsByGenre?.length > 5;
  const { playSingleSong } = usePlayBar();

  return (
    <>
      <div>
        <SectionHeader isPending={isUserPlaylistsPending} title={topPlaylistsTitle} />
        <PlaylistsSlider
          isLoading={isUserPlaylistsPending || isTrendingPlaylistsPending}
          playlists={
            showUserPlaylists
              ? [{ id: 0, type: 'add-playlist-button' }, ...userPlaylists]
              : [{ id: 0, type: 'add-playlist-button' }, ...(trendingPlaylists ?? [])]
          }
        />
      </div>

      {(isRecommendedPlaylistsPending || showRecommendedPlaylists) && (
        <div>
          <SectionHeader
            title="Playlists Tailored for You"
            isPending={isRecommendedPlaylistsPending}
          />
          <PlaylistsSlider
            playlists={[{ id: 0, type: 'favorite-songs' }, ...(recommendedPlaylists ?? [])]}
            isLoading={isRecommendedPlaylistsPending}
          />
        </div>
      )}

      <div>
        <SectionHeader title={albumsTitle} isPending={isRecommendedAlbumsPending} />
        <AlbumsSlider
          albums={recommendedAlbums?.length ? recommendedAlbums : trendingAlbums}
          isLoading={isRecommendedAlbumsPending || isTrendingAlbumsPending}
        />
      </div>

      <div className="-mt-11">
        <SectionHeader
          title="Daily Picks"
          isPending={isRecommendedSongsPending || isTrendingSongsPending}
        />
        <PlayBarSlider
          songs={showRecommendedSongs ? recommendedSongs : trendingSongs}
          isPending={isRecommendedSongsPending || isTrendingSongsPending}
          onPlay={playSingleSong}
        />
      </div>
      <div>
        <SectionHeader title="Popular artists" />
        <ArtistsSlider artists={trendingArtists} isLoading={isTrendingArtistsPending} />
      </div>
      <DiscoverPlaylistsSlider playlists={playlists} />
      {(showRecommendedPlaylistsByGenre || isRecommendedPlaylistsByGenrePending) && (
        <div>
          <SectionHeader
            title={`Since You Enjoy ${userMostLikedGenre?.title}`}
            isPending={isRecommendedPlaylistsByGenrePending}
          />
          <PlaylistsSlider
            playlists={recommendedPlaylistsByGenre}
            isPending={isRecommendedPlaylistsByGenrePending}
          />
        </div>
      )}
      <div>
        <SectionHeader
          title={showRecentAlbums ? 'Albums you were listening to' : 'Best of hip-hop'}
        />
        <AlbumsSlider
          albums={showRecentAlbums ? recentAlbums : hipHopAlbums}
          isLoading={isRecentAlbumsPending || isHopHopAlbumsLoading}
        />
      </div>
      <div>
        <SectionHeader title="Genres You might like" />
        <GenresSlider genres={userTopGenres} isPending={isUserTopGenresPending} />
      </div>
      {(isRecentSongsPending || showRecentSongs) && (
        <div className="-mt-8">
          <SectionHeader title="Recently listened" />
          <PlayBarSlider
            songs={recentSongs}
            isPending={isRecentSongsPending}
            onPlay={playSingleSong}
          />
        </div>
      )}
    </>
  );
}
