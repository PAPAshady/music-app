import PropTypes from 'prop-types';
import { setCurrentQueuelist, setSelectedSong } from '../../../redux/slices/playContextSlice';
import IconButton from '../../Buttons/IconButton/IconButton';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { memo } from 'react';
import { AddCircle, Play, Pause, Trash } from 'iconsax-reactjs';
import { play, pause, setCurrentSongIndex } from '../../../redux/slices/musicPlayerSlice';
import { useSelector, useDispatch } from 'react-redux';
import playlistDefaultCover from '../../../assets/images/covers/no-cover.jpg';

const PlaylistSong = memo(({ song, buttonState, onClick }) => {
  const { title, cover, artist, id } = song;
  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.musicPlayer.isPlaying);
  const currentMusicId = useSelector((state) => state.musicPlayer.currentMusic?.id);
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
    <div className="border-secondary-200 flex items-center justify-between gap-2 rounded-sm border py-1 ps-1">
      <div className="flex grow items-center gap-2 overflow-hidden">
        <div
          className="relative h-[45px] w-[45px] min-w-[45px] overflow-hidden rounded-sm"
          onClick={playOnClick}
        >
          <img src={cover ? cover : playlistDefaultCover} className="size-full object-cover" />
          <button className="absolute inset-0 flex items-center justify-center bg-black/20">
            {isCurrentSongPlaying && isPlaying ? (
              <Pause size={18} className="fill-white" />
            ) : (
              <Play size={18} className="fill-white" />
            )}
          </button>
        </div>
        <div className="flex grow flex-col gap-1 overflow-hidden">
          <p className="truncate text-sm">{title}</p>
          <p className="text-secondary-200 truncate text-sm">{artist}</p>
        </div>
      </div>
      {buttonState === 'pending' ? (
        <LoadingSpinner size="xs" classNames="me-2.5" />
      ) : (
        <IconButton
          icon={buttonState === 'add' ? <AddCircle /> : <Trash />}
          onClick={() => onClick(id)}
          classNames="min-w-8 min-h-8 me-1"
        />
      )}
    </div>
  );
});

PlaylistSong.displayName = 'PlaylistSong';
PlaylistSong.propTypes = {
  song: PropTypes.object.isRequired,
  buttonState: PropTypes.oneOf(['add', 'view', 'pending']),
  onClick: PropTypes.func.isRequired,
};

export default PlaylistSong;
