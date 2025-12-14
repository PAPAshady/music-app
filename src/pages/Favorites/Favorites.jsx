import bannerBg from '../../assets/images/backgrounds/player-and-settings-page.png';
import SectionTitle from '../../components/SectionHeader/SectionHeader';
import AlbumsSlider from '../../components/Sliders/AlbumsSlider/AlbumsSlider';
import { useQuery } from '@tanstack/react-query';
import 'swiper/css';
import 'swiper/css/pagination';
import { getFavoriteSongsQueryOptions } from '../../queries/songs';
import PlayBarSlider from '../../components/Sliders/PlayBarSlider/PlayBarSlider';
import usePlayBar from '../../hooks/usePlayBar';
import { getFavoritePlaylistsQueryOptions } from '../../queries/playlists';
import PlaylistsSlider from '../../components/Sliders/PlaylistsSlider/PlaylistsSlider';
import { getFavoriteAlbumsQueryOptions } from '../../queries/albums';
import ShimmerOverlay from '../../components/ShimmerOverlay/ShimmerOverlay';

export default function Favorites() {
  const { data: favoriteAlbums, isPending: isFavoriteAlbumsPending } = useQuery(
    getFavoriteAlbumsQueryOptions()
  );
  const { data: favoriteSongs, isPending: isFavoriteSongsPending } = useQuery(
    getFavoriteSongsQueryOptions()
  );
  const { playFavoriteSongs } = usePlayBar();
  const { data: favoritePlaylists, isPending: isFavoritePlaylistsPending } = useQuery(
    getFavoritePlaylistsQueryOptions()
  );
  const noFavorites =
    !favoriteAlbums?.length && !favoritePlaylists?.length && !favoriteSongs?.length;

  const isPagePending =
    isFavoriteAlbumsPending || isFavoritePlaylistsPending || isFavoriteSongsPending;

  return (
    <>
      {isPagePending ? (
        <div className="border-primary-300 relative h-full grow overflow-hidden rounded-4xl border bg-gray-800/50 bg-cover">
          <ShimmerOverlay />
          <div
            className={`size-full px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16 xl:px-12 xl:py-20`}
          >
            <div className="relative mb-3 h-4 w-4/5 overflow-hidden rounded-full bg-gray-600/60 sm:mb-5 md:mb-6 lg:h-6">
              <ShimmerOverlay />
            </div>
            <div className="relative mb-2 h-2.5 w-3/5 overflow-hidden rounded-full bg-gray-600/60 lg:mb-3 lg:h-3.5">
              <ShimmerOverlay />
            </div>
            <div className="relative h-2.5 w-1/2 overflow-hidden rounded-full bg-gray-600/60 lg:h-3.5">
              <ShimmerOverlay />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="border-primary-300 relative h-full grow overflow-hidden rounded-4xl border bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bannerBg})` }}
        >
          <div
            className={`size-full px-4 py-10 backdrop-blur-[2px] sm:px-6 sm:py-14 lg:px-10 lg:py-16 xl:px-12 xl:py-20`}
          >
            <h3 className="text-primary-300 mb-3 text-2xl font-bold sm:text-3xl md:mb-6 lg:text-5xl">
              {noFavorites ? 'You haven’t liked anything yet.' : 'Favorite Music'}
            </h3>
            <p className="text-primary-200 sm:text-lg">
              {noFavorites
                ? 'Your favorites are empty for now. Start liking songs, playlists, or albums to fill this space'
                : 'Because Favorites Deserve Their Own Space...'}
            </p>
          </div>
        </div>
      )}

      {(isFavoriteSongsPending || !!favoriteSongs?.length) && (
        <div>
          <SectionTitle title="Your favorite tracks" />
          <PlayBarSlider
            songs={favoriteSongs}
            isPending={isFavoriteSongsPending}
            onPlay={playFavoriteSongs}
          />
        </div>
      )}
      {(isFavoritePlaylistsPending || !!favoritePlaylists?.length) && (
        <div>
          <SectionTitle title="Your beloved playlists" />
          <PlaylistsSlider playlists={favoritePlaylists} isLoading={isFavoritePlaylistsPending} />
        </div>
      )}
      {(isFavoriteAlbumsPending || !!favoriteAlbums?.length) && (
        <div>
          <SectionTitle title="Albums you loved" />
          <AlbumsSlider
            albums={favoriteAlbums}
            isLoading={isFavoriteAlbumsPending}
            albumCardSize="md"
            albumCardStyles="!max-w-none"
          />
        </div>
      )}
    </>
  );
}
