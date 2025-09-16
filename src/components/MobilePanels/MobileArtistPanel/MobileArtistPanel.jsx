import { useSelector, useDispatch } from 'react-redux';
import playlistDefaultCover from '../../../assets/images/Avatar/no-avatar.png';
import MainButton from '../../Buttons/MainButton/MainButton';
import DropDownList from '../../DropDownList/DropDownList';
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

function MobileArtistPanel() {
  const dispatch = useDispatch();
  const artist = useSelector((state) => state.artist);
  const playingState = useSelector((state) => state.musicPlayer.playingState);
  const isPlaying = useSelector((state) => state.musicPlayer.isPlaying);
  const isTablet = useMediaQuery('(min-width: 768px)');
  const isLargeMobile = useMediaQuery('(min-width: 420px)');
  const { data: popularSongs, isPending: isPopularSongsPending } = useQuery({
    ...getPopularSongsByArtistIdQueryOptions(artist.id),
    select: (data) => data.slice(0, 5),
  });
  const { playArtistSongs } = usePlayBar(artist?.id);
  const dropDownListItems = [];

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
              src={artist.image ?? playlistDefaultCover}
              className="size-full rounded-sm object-cover"
            />
          </button>

          <MainButton size="sm" variant="primary" type="outline" title="Follow" />
          <DropDownList menuItems={dropDownListItems} dropDownPlacement="bottom start" />
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

      <div className="w-full">
        <p className="gap-3 px-4 py-2 text-center text-2xl font-bold">Popular</p>
        {isPopularSongsPending ? (
          Array(8)
            .fill()
            .map((_, index) => (
              <PlayBarSkeleton
                key={index}
                size={isLargeMobile ? 'lg' : 'md'}
                classNames="!w-full text-start !max-w-none"
              />
            ))
        ) : !popularSongs.length ? (
          <div className="my-2 w-full">
            <p className="text-gray-400 md:text-lg">No tracks from this artist.</p>
          </div>
        ) : (
          <>
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
            <p className="mt-2 text-gray-400">
              {popularSongs.length} song{popularSongs.length > 1 && 's'}
            </p>
          </>
        )}
      </div>
    </>
  );
}

export default MobileArtistPanel;
