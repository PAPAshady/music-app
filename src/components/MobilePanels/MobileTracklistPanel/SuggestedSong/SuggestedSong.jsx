import { memo } from 'react';
import { AddCircle } from 'iconsax-react';
import PropTypes from 'prop-types';
import LoadingSpinner from '../../../LoadingSpinner/LoadingSpinner';
import { setCurrentQueuelist, setSelectedSong } from '../../../../redux/slices/playContextSlice';
import { useDispatch, useSelector } from 'react-redux';
import { play, pause } from '../../../../redux/slices/musicPlayerSlice';
import { setCurrentSongIndex } from '../../../../redux/slices/musicPlayerSlice';
import { Play, Pause } from 'iconsax-react';
import IconButton from '../../../Buttons/IconButton/IconButton';
import playlistDefaultCover from '../../../../assets/images/covers/no-cover.jpg';

const SuggestedSong = memo(({ isPending, onAdd, song }) => {
  const { id, title, cover, artist } = song;
  const dispatch = useDispatch();
  const currentMusicId = useSelector((state) => state.musicPlayer.currentMusic?.id);
  const isPlaying = useSelector((state) => state.musicPlayer.isPlaying);
  const isCurrentSongPlaying = id === currentMusicId;

  const playOnClick = () => {
    if (isCurrentSongPlaying) {
      dispatch(isPlaying ? pause() : play());
    } else {
      dispatch(setCurrentQueuelist([song]));
      dispatch(setCurrentSongIndex(0));
      dispatch(setSelectedSong(song));
    }
  };

  return (
    <div className="border-secondary-200 flex items-center justify-between gap-2 rounded-sm md:border">
      <div className="flex grow items-center gap-2 overflow-hidden">
        <div
          className="relative h-15 w-15 min-w-[60px] overflow-hidden rounded-sm sm:h-[70px] sm:w-[70px] sm:min-w-[70px]"
          onClick={playOnClick}
        >
          <img
            src={cover ? cover : playlistDefaultCover}
            alt={title}
            className="size-full object-cover"
          />
          <button className="absolute inset-0 flex items-center justify-center bg-black/50">
            {isCurrentSongPlaying && isPlaying ? (
              <Pause className="fill-white" />
            ) : (
              <Play className="fill-white" />
            )}
          </button>
        </div>
        <div className="flex grow flex-col gap-1.5 overflow-hidden">
          <p className="truncate text-[0.9rem] min-[480px]:text-base" title={title}>
            {title}
          </p>
          <p className="text-secondary-200 truncate text-xs min-[480px]:text-sm" title={artist}>
            {artist}
          </p>
        </div>
      </div>
      {isPending ? (
        <LoadingSpinner classNames="me-0.5" />
      ) : (
        <IconButton
          icon={<AddCircle />}
          classNames="min-w-8.5 min-h-8.5 sm:min-w-10 sm:min-h-10 md:me-1"
          onClick={() => onAdd(id)}
        />
      )}
    </div>
  );
});

SuggestedSong.displayName = 'SuggestedSong';
SuggestedSong.propTypes = {
  song: PropTypes.object.isRequired,
  isPending: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
};

export default SuggestedSong;
