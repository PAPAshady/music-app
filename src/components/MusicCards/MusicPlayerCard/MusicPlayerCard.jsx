import IconButton from '../../Buttons/IconButton/IconButton';
import { Heart } from 'iconsax-react';
import noCoverImg from '../../../assets/images/covers/no-cover.jpg';
import PropTypes from 'prop-types';
import { formatTime } from '../../../redux/slices/musicPlayerSlice';
import { useMutation } from '@tanstack/react-query';
import { likeSongMutationOptions, unlikeSongMutationOptions } from '../../../queries/likes';
import { useSelector } from 'react-redux';

export default function MusicPlayerCard({
  title,
  artist = 'Unkown artist',
  duration,
  cover = noCoverImg,
  isPlaying,
  is_liked,
  onClick,
  classNames,
  musicIndex,
  id,
}) {
  const userId = useSelector((state) => state.auth.user.id);
  const likeHandlerMutation = useMutation(
    is_liked ? unlikeSongMutationOptions() : likeSongMutationOptions()
  );

  return (
    <div
      className={`border-secondary-300 hover:border-secondary-50 flex items-center gap-2 overflow-hidden rounded-lg border-2 p-2 transition-all duration-300 ${classNames} ${isPlaying ? 'bg-secondary-600/40 backdrop-blur-xs' : '!border-transparent'}`}
    >
      <img
        onClick={() => onClick(musicIndex)}
        src={cover}
        alt={title}
        className={`size-24 cursor-pointer rounded-md border-2 border-transparent object-cover transition-colors duration-300 ${!isPlaying ? 'hover:border-secondary-300' : ''}`}
      />
      <div
        className={`grow overflow-hidden transition-all duration-300 ${isPlaying ? 'visible opacity-100' : 'invisible opacity-0'}`}
      >
        <div className="mb-2">
          <h3
            onClick={() => onClick(musicIndex)}
            className="text-primary-50 mb-1 cursor-pointer truncate text-base"
            title={title}
          >
            {title}
          </h3>
          <p className="text-primary-100 truncate text-sm" title={artist}>
            {artist}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-primary-100 text-sm">{formatTime(duration)}</span>
          <IconButton
            icon={<Heart className={is_liked ? 'fill-secondary-50 text-secondary-50' : ''} />}
            onClick={() => likeHandlerMutation.mutate({ songId: id, userId })}
          />
        </div>
      </div>
    </div>
  );
}

MusicPlayerCard.propTypes = {
  title: PropTypes.string.isRequired,
  artist: PropTypes.string,
  isFavorite: PropTypes.bool,
  duration: PropTypes.number,
  cover: PropTypes.string,
  isPlaying: PropTypes.bool,
  onClick: PropTypes.func,
  classNames: PropTypes.string,
  id: PropTypes.string.isRequired,
  is_liked: PropTypes.bool,
  musicIndex: PropTypes.number.isRequired,
};
