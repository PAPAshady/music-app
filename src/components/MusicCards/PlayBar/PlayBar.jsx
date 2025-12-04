import { memo, cloneElement } from 'react';
import { Heart, Play, AddCircle } from 'iconsax-react';
import IconButton from '../../Buttons/IconButton/IconButton';
import noCoverImg from '../../../assets/images/covers/no-cover.jpg';
import { formatTime } from '../../../redux/slices/musicPlayerSlice';
import PropTypes from 'prop-types';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { useMutation } from '@tanstack/react-query';
import { likeSongMutationOptions, unlikeSongMutationOptions } from '../../../queries/likes';
import { useSelector, useDispatch } from 'react-redux';
import { openMobilePanel as openAddSongToPlaylistMobilePanel } from '../../../redux/slices/addSongToPlaylistSlice';

const PlayBar = memo(
  ({
    size,
    index: songIndex,
    song,
    onPlay,
    ActionButtonIcon,
    actionButtonClickHandler,
    isActionButtonPending,
    classNames,
  }) => {
    const dispatch = useDispatch();
    const { title, id, cover, artist, duration, album, is_liked } = song;
    const likeHandlerMutation = useMutation(
      is_liked ? unlikeSongMutationOptions() : likeSongMutationOptions()
    );
    const currentMusicId = useSelector((state) => state.musicPlayer.currentMusic?.id);
    const isCurrentSongPlaying = currentMusicId === id;

    // add a glowing style around the borders if the current song is playing.
    const activeStateStyles = `${isCurrentSongPlaying ? `border-primary-100 shadow-[1px_1px_5px_rgba(216,223,245,.4),-1px_-1px_6px_rgba(216,223,245,.4)] ${size === 'sm' ? '!inset-shadow-[1px_1px_10px] !inset-shadow-[#d8dff5]/80 ' : '!inset-shadow-[#d8dff5]/45 '}` : 'border-primary-300'}`;

    const musicTitleSizes = {
      lg: 'text-base lg:text-xl',
      md: 'paragraph-1',
      sm: 'text-sm',
    };

    const albumNameSizes = {
      lg: 'text-base lg:max-w-[250px] lg:w-[250px] lg:truncate',
      md: 'text-sm',
      sm: 'hidden',
    };

    return (
      <div
        className={`bg-primary-800/60 hover:inset-shadow-secondary-400 group hover:bg-primary-700/40 lg:hover:bg-primary-800 flex max-w-[285px] items-center justify-between gap-4 rounded-lg border p-1.5 inset-shadow-transparent transition-all duration-300 lg:inset-shadow-[2px_2px_15px] ${activeStateStyles} ${size === 'lg' ? 'lg:max-w-[890px]' : 'lg:max-w-[510px]'} ${classNames}`}
      >
        <div
          className={`flex grow gap-2 overflow-hidden ${size === 'lg' ? 'lg:w-[270px] lg:max-w-[270px] lg:truncate' : ''}`}
        >
          <button
            className="relative size-14 min-h-14 min-w-14 overflow-hidden rounded-md"
            onClick={() => onPlay(song, songIndex)}
          >
            <img
              src={cover ? cover : noCoverImg}
              className="size-full object-cover"
              alt={title}
              loading="lazy"
            />
            <span
              className={`absolute top-1/2 left-1/2 flex size-full -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-transparent opacity-0 transition-all duration-300 group-hover:bg-black/60 group-hover:opacity-100`}
            >
              <span className="size-6 lg:size-8">
                <Play size="100%" />
              </span>
            </span>
          </button>
          <div className="flex flex-col overflow-hidden">
            <button
              className={`text-white-50 grow truncate text-start ${musicTitleSizes[size]}`}
              onClick={() => onPlay(song, songIndex)}
              title={title}
            >
              {title}
            </button>
            <span className="text-secondary-200 grow truncate text-[13px]" title={artist}>
              {artist}
            </span>
          </div>
        </div>

        <div
          className={`flex items-center justify-between gap-4 ${size !== 'sm' ? 'lg:grow-3 lg:pe-3' : ''}`}
        >
          {size !== 'sm' && (
            <>
              <p className={`hidden lg:block ${albumNameSizes[size]}`}>{album}</p>
              <span
                className={`text-secondary-200 pe-3 text-xs lg:p-0 ${size === 'lg' ? 'lg:text-sm' : 'hidden lg:block'}`}
              >
                {formatTime(duration)}
              </span>
            </>
          )}
          <div className={`flex items-center gap-2 ${size !== 'sm' ? 'lg:gap-4' : ''}`}>
            <div className={` ${size === 'md' ? 'block lg:hidden' : 'block'}`}>
              {isActionButtonPending ? (
                <LoadingSpinner />
              ) : ActionButtonIcon ? (
                <IconButton icon={ActionButtonIcon} onClick={() => actionButtonClickHandler(id)} />
              ) : (
                <IconButton
                  icon={
                    <Heart
                      className={`transition-colors ${is_liked ? 'text-secondary-50 fill-secondary-50' : ''}`}
                    />
                  }
                  onClick={() => likeHandlerMutation.mutate(id)}
                />
              )}
            </div>
            <div>
              <IconButton
                icon={<AddCircle size={size === 'sm' ? 16 : 24} />}
                label="Add to playlist"
                onClick={() => dispatch(openAddSongToPlaylistMobilePanel(id))}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

function DropDownMenuItem({ icon, title, onClick }) {
  const styledIcon = cloneElement(icon, { size: '100%' });

  return (
    <li>
      <button onClick={onClick} className="hover:bg-primary-400/60 w-full cursor-default">
        <div className="flex items-center gap-2 p-2 text-start text-sm">
          <span className="size-5">{styledIcon}</span>
          <span>{title}</span>
        </div>
      </button>
    </li>
  );
}

PlayBar.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']).isRequired,
  index: PropTypes.number,
  song: PropTypes.object,
  onPlay: PropTypes.func,
  ActionButtonIcon: PropTypes.node,
  actionButtonClickHandler: PropTypes.func,
  isActionButtonPending: PropTypes.bool,
  onLikeChange: PropTypes.func,
  classNames: PropTypes.string,
};

DropDownMenuItem.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

PlayBar.displayName = 'PlayBar';
export default PlayBar;
