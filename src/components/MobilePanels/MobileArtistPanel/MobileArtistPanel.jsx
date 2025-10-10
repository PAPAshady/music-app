import { useSelector, useDispatch } from 'react-redux';
import artistDefaultImage from '../../../assets/images/Avatar/no-avatar.png';
import MainButton from '../../Buttons/MainButton/MainButton';
import IconButton from '../../Buttons/IconButton/IconButton';
import { Shuffle, RepeateOne, RepeateMusic, Play, Pause, Heart } from 'iconsax-react';
import { togglePlayState } from '../../../redux/slices/musicPlayerSlice';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { useQuery } from '@tanstack/react-query';
import { getPopularSongsByArtistIdQueryOptions } from '../../../queries/musics';
import PlayBar from '../../MusicCards/PlayBar/PlayBar';
import PlayBarSkeleton from '../../MusicCards/PlayBar/PlayBarSkeleton';
import { setCurrentQueuelist } from '../../../redux/slices/playContextSlice';
import { setCurrentSongIndex } from '../../../redux/slices/musicPlayerSlice';
import usePlayBar from '../../../hooks/usePlayBar';
import AlbumsSlider from '../../Sliders/AlbumsSlider/AlbumsSlider';
import { getAlbumsByArtistIdQueryOptions } from '../../../queries/albums';
import { getRelatedArtistsQueryOptions } from '../../../queries/artists';
import ArtistsSlider from '../../Sliders/ArtistsSlider/ArtistsSlider';
import useQueryState from '../../../hooks/useQueryState';
import { getArtistByIdQueryOptions } from '../../../queries/artists';

function MobileArtistPanel() {
  const dispatch = useDispatch();
  const artistId = useQueryState().getQuery('id');
  const { data: artist } = useQuery(getArtistByIdQueryOptions(artistId));
  const playingState = useSelector((state) => state.musicPlayer.playingState);
  const isPlaying = useSelector((state) => state.musicPlayer.isPlaying);
  const isTablet = useMediaQuery('(min-width: 768px)');
  const isLargeMobile = useMediaQuery('(min-width: 420px)');
  const { data: popularSongs, isPending: isPopularSongsPending } = useQuery({
    ...getPopularSongsByArtistIdQueryOptions(artistId),
    select: (data) => data.slice(0, 5),
  });
  const { playArtistSongs } = usePlayBar(artistId);
  const { data: albums, isPending: isAlbumsPending } = useQuery(
    getAlbumsByArtistIdQueryOptions(artistId)
  );
  const { data: relatedArtists, isPending: isRelatedArtistsPending } = useQuery(
    getRelatedArtistsQueryOptions(artist)
  );

  const playPauseHandler = () => {
    dispatch(setCurrentQueuelist(popularSongs));
    dispatch(setCurrentSongIndex(0));
  };

  return (
    <>
      <div className="mt-3 flex w-full items-center justify-between gap-2 lg:px-8">
        <div className="flex items-center gap-3.5 sm:gap-5 md:gap-7">
          <button className="border-primary-200 h-10 w-8 rounded-sm border p-[2px] sm:h-12 sm:w-9">
            <img
              src={artist?.image || artistDefaultImage}
              className="size-full rounded-sm object-cover"
            />
          </button>

          <MainButton size="sm" variant="primary" type="outline" title="Follow" />
        </div>
        <div className="flex items-center gap-3.5 sm:gap-5 md:gap-7">
          <IconButton
            icon={
              playingState === 'shuffle' ? (
                <Shuffle />
              ) : playingState === 'repeat_one' ? (
                <RepeateOne />
              ) : (
                <RepeateMusic />
              )
            }
            classNames="sm:size-9 md:size-10"
            onClick={() => dispatch(togglePlayState())}
          />
          <MainButton
            classNames="size-12 sm:size-14 md:size-20 !rounded-full flex justify-center items-center"
            title={
              isPlaying ? <Pause size={isTablet ? 32 : 24} /> : <Play size={isTablet ? 32 : 24} />
            }
            onClick={playPauseHandler}
            disabled={!popularSongs?.length}
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-7">
        <div>
          <p className="px-4 py-4 text-center text-2xl font-bold">Popular</p>

          {isPopularSongsPending ? (
            <div className="mt-8 flex w-full grow flex-col items-center gap-3 sm:gap-4 md:gap-5 md:pb-4">
              {Array(5)
                .fill()
                .map((_, index) => (
                  <PlayBarSkeleton
                    key={index}
                    size={isLargeMobile ? 'lg' : 'md'}
                    classNames="!w-full text-start !max-w-none"
                  />
                ))}
            </div>
          ) : popularSongs.length ? (
            <div className="mt-8 flex w-full grow flex-col items-center gap-3 sm:gap-4 md:gap-5 md:pb-4">
              {popularSongs.map((song, index) => (
                <PlayBar
                  key={song.id}
                  size={isLargeMobile ? 'lg' : 'md'}
                  index={index}
                  classNames="!w-full text-start !max-w-none"
                  ActionButtonIcon={<Heart />}
                  actionButtonClickHandler={() => {}}
                  song={song}
                  onPlay={playArtistSongs}
                />
              ))}
            </div>
          ) : (
            <div className="my-2 w-full">
              <p className="text-gray-400 md:text-lg">No tracks from this artist.</p>
            </div>
          )}
        </div>

        <div>
          <p className="px-4 pt-4 pb-8 text-center text-2xl font-bold">Albums</p>
          {albums?.length ? (
            <AlbumsSlider albums={albums} isLoading={isAlbumsPending} />
          ) : (
            <p className="text-gray-400 md:text-lg">No albums from this artist.</p>
          )}
        </div>
        <div>
          <p className="px-4 pb-8 text-center text-2xl font-bold">Fans also like</p>
          <ArtistsSlider artists={relatedArtists} isLoading={isRelatedArtistsPending} />
        </div>
      </div>
    </>
  );
}

export default MobileArtistPanel;
