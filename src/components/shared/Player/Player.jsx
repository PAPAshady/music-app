import { useEffect, useState, cloneElement } from 'react';
import useCloseOnClickOutside from '../../../hooks/useCloseOnClickOutside';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import {
  Pause,
  Play,
  Next,
  Previous,
  RepeateOne as RepeatOne,
  RepeateMusic,
  Shuffle,
  MusicFilter,
  Heart,
  VolumeHigh,
  VolumeSlash,
} from 'iconsax-reactjs';
import IconButton from '../../Buttons/IconButton/IconButton';
import noCoverImg from '../../../assets/images/covers/no-cover.jpg';
import { Range } from 'react-range';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  togglePanel as togglePlayerPanel,
  openPanel as openPlayerPanel,
} from '../../../redux/slices/playerPanelSlice';
import PlayerProgressBar from '../../PlayerProgressBar/PlayerProgressBar';
import {
  formatTime,
  music,
  pause,
  play,
  next,
  prev,
  togglePlayState,
  setVolume,
} from '../../../redux/slices/musicPlayerSlice';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { useMutation } from '@tanstack/react-query';
import { likeSongMutationOptions, unlikeSongMutationOptions } from '../../../queries/likes';

export default function Player({ classNames, isPlayerPage }) {
  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.musicPlayer.isPlaying);
  const queuelist = useSelector((state) => state.playContext.currentQueuelist);
  const currentMusic = useSelector((state) => state.musicPlayer.currentMusic);
  const playingState = useSelector((state) => state.musicPlayer.playingState);
  const musicState = useSelector((state) => state.musicPlayer.musicState);
  const musicVolume = useSelector((state) => state.musicPlayer.volume);
  const isPlayerPanelOpen = useSelector((state) => state.playerPanel.isOpen);
  const volume = [musicVolume];
  const verticalVolumeSlider = useCloseOnClickOutside();

  const disabled = !queuelist?.length;
  const isLargeMobile = useMediaQuery('(max-width: 639px)');
  const isMobile = useMediaQuery('(min-width: 768px)');
  const likeHandlerMutation = useMutation(
    currentMusic?.is_liked ? unlikeSongMutationOptions() : likeSongMutationOptions()
  );

  useEffect(() => {
    music.volume = musicVolume / 100;
  }, [musicVolume]);

  const changeVolumeHandler = ([volume]) => {
    music.volume = volume / 100;
    // setVolume([volume]);
    dispatch(setVolume(volume));
  };

  const playButtons = [
    { id: 1, icon: <Previous />, onClick: () => dispatch(prev()) },
    {
      id: 2,
      icon: isPlaying ? <Pause /> : <Play />,
      onClick: () => dispatch(isPlaying ? pause() : play()),
    },
    { id: 3, icon: <Next />, onClick: () => dispatch(next()) },
  ];

  // opens player panel when user click on the player on mobile devices (only in devices with the max-width of 768px)
  const openPlayerPanelOnClick = () => {
    if (!isMobile) dispatch(openPlayerPanel());
  };

  // avoids opening player panel on mobile devices in case user click on certian elements such as play buttons, song cover, progres bar, etc.
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      className={`border-secondary-300 bg-secondary-700/64 xs:items-start xs:pt-4 xs:pb-3 group fixed bottom-0 left-0 z-10 flex w-full items-center gap-3 rounded-t-lg border-t px-3 pt-3 pb-2 backdrop-blur-xs transition-all duration-300 min-[400px]:items-center min-[480px]:p-4 min-[1330px]:w-[64dvw]! sm:items-center sm:gap-4 md:sticky md:bottom-2 md:justify-between md:gap-8 md:rounded-lg md:border xl:w-[62.6dvw] xl:gap-4 2xl:w-full! ${disabled && !isPlayerPage ? 'translate-y-full opacity-0 md:translate-y-[calc(100%+8px)]' : 'translate-y-0 opacity-100'} ${classNames}`}
      onClick={openPlayerPanelOnClick}
    >
      <div className="flex items-center gap-4">
        <div
          className="relative size-12 overflow-hidden rounded-lg min-[400px]:size-15 sm:size-20 md:size-16"
          onClick={stopPropagation}
        >
          <img
            className="size-full object-cover"
            src={currentMusic?.cover || noCoverImg}
            alt={currentMusic?.title}
          />
          {musicState !== 'playable' ? (
            <div className="absolute inset-0 flex size-full items-center justify-center bg-black/50">
              <LoadingSpinner size={isLargeMobile ? 'sm' : 'md'} />
            </div>
          ) : (
            <div
              className={`absolute top-0 flex size-full items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${disabled && 'hidden'}`}
            >
              <button onClick={() => likeHandlerMutation.mutate(currentMusic?.id)}>
                <Heart
                  size={28}
                  className={`transitions-colors duration-300 ${currentMusic?.is_liked ? 'fill-secondary-50 text-secondary-50' : ''}`}
                />
              </button>
            </div>
          )}
        </div>
        <div className="hidden w-42.5 truncate md:block">
          <p className="text-white-50 truncate font-semibold">
            {currentMusic?.title || 'No music is playing'}
          </p>
          <p className="text-primary-100 truncate text-sm">{currentMusic?.artist || 'No Artist'}</p>
        </div>
      </div>

      <div className="flex grow items-end gap-8">
        <div className="flex grow flex-col gap-2 min-[400px]:gap-3 md:gap-4">
          <div className="flex items-center justify-between">
            <div className="md:hidden">
              <p className="text-primary-50 xs:text-sm pb-1 text-xs min-[480px]:text-base sm:text-lg">
                {currentMusic?.title || 'No music is playing'}
              </p>
              <p className="text-primary-100 hidden sm:block">
                {currentMusic?.artist || 'No Artist'}
              </p>
            </div>
            <CurrentTimeNumber />
            <div
              className="xs:gap-5 flex items-center gap-4 min-[400px]:gap-6 sm:gap-10 md:gap-12 2xl:gap-16!"
              onClick={stopPropagation}
            >
              {playButtons.map((button) => (
                <PlayButton key={button.id} {...button} disabled={disabled} />
              ))}
            </div>
            <span className="text-primary-100 hidden w-10.5 text-end text-sm md:block">
              {formatTime(currentMusic?.duration) ?? '00:00'}
            </span>
          </div>
          <div onClick={stopPropagation}>
            <PlayerProgressBar disabled={disabled} />
          </div>
        </div>
        <div className="ms-4 hidden items-center gap-4 md:flex">
          <div title={playingState}>
            <IconButton
              onClick={() => dispatch(togglePlayState())}
              icon={
                playingState === 'shuffle' ? (
                  <Shuffle />
                ) : playingState === 'repeat_one' ? (
                  <RepeatOne />
                ) : (
                  <RepeateMusic />
                )
              }
              classNames={`hidden ${isPlayerPage ? 'md:flex' : 'xl:flex'} `}
            />
          </div>
          <IconButton
            icon={<MusicFilter />}
            onClick={() => dispatch(togglePlayerPanel())}
            isActive={isPlayerPanelOpen}
            label={isPlayerPanelOpen ? 'Close player panel' : 'Open player panel'}
          />
          <div
            className="relative hidden items-center gap-2 md:flex"
            ref={verticalVolumeSlider.setRef}
            onClick={stopPropagation}
          >
            <IconButton
              icon={volume[0] ? <VolumeHigh /> : <VolumeSlash />}
              onClick={() => verticalVolumeSlider.setIsVisible((prev) => !prev)}
            />

            {/* Horizantal volume slider */}
            <Range
              values={volume}
              onChange={changeVolumeHandler}
              min={0}
              max={100}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  className={`border-primary-400 hidden h-1.5 w-24 cursor-pointer rounded-lg border ${isPlayerPage ? 'lg:block' : '2xl:block'} `}
                >
                  <div
                    className="bg-primary-400 border-primary-400 h-full rounded-lg border"
                    style={{ width: `${volume[0]}%` }}
                  ></div>
                  {children}
                </div>
              )}
              renderThumb={({ props, isDragged }) => (
                <div
                  className="bg-primary-400 top-0 h-3 w-3 rounded-full outline-none"
                  {...props}
                  key={2}
                >
                  <span
                    className={`bg-primary-400 absolute left-1/2 -translate-x-1/2 rounded-sm px-1.5 py-0.5 text-xs transition-all delay-150 duration-300 ${isDragged ? '-top-6.5 opacity-100' : '-top-5 opacity-0'}`}
                  >
                    {volume[0]}
                  </span>
                </div>
              )}
            />

            {/* Vertical volume slider (for devices less than 1400px) */}
            <div
              className={`bg-secondary-400/40 border-secondary-300 absolute left-1/2 flex w-8 -translate-x-1/2 justify-center rounded-xl border py-4 backdrop-blur-md transition-all duration-200 ${verticalVolumeSlider.isVisible ? 'visible bottom-[130%] opacity-100' : 'invisible bottom-full opacity-0'} ${isPlayerPage ? 'lg:hidden' : '2xl:hidden'}`}
            >
              <Range
                values={volume}
                onChange={changeVolumeHandler}
                min={0}
                max={100}
                direction="to top"
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="border-primary-400 relative flex h-24 w-1.5 items-end rounded-full border"
                  >
                    <div
                      className="bg-primary-400 flex w-full items-start justify-center rounded-full"
                      style={{ height: `${volume[0]}%` }}
                    ></div>
                    {children}
                  </div>
                )}
                renderThumb={({ props, isDragged }) => (
                  <div className="bg-primary-400 top-0 h-3 w-3 rounded-full" {...props} key={3}>
                    <span
                      className={`bg-primary-400 absolute top-1/2 -translate-y-1/2 rounded-sm px-1.5 py-0.5 text-xs transition-all delay-150 duration-300 ${isDragged ? 'left-4 opacity-100' : 'left-3 opacity-0'}`}
                    >
                      {volume[0]}
                    </span>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayButton({ icon, onClick, disabled }) {
  const styledIcon = cloneElement(icon, { size: '100%' });
  return (
    <button
      className="disabled:text-white-700 xs:size-4.5 size-4 disabled:cursor-not-allowed min-[480px]:size-5 sm:size-6 2xl:size-7!"
      onClick={onClick}
      disabled={disabled}
    >
      {styledIcon}
    </button>
  );
}

function CurrentTimeNumber() {
  const [currentTime, setCurrentTime] = useState('0:00');

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(formatTime(music.currentTime));
    };

    music.addEventListener('timeupdate', updateCurrentTime);

    return () => {
      music.removeEventListener('timeupdate', updateCurrentTime);
    };
  }, []);

  return <span className="text-primary-100 hidden w-10.5 text-sm md:block">{currentTime}</span>;
}

PlayButton.propTypes = {
  icon: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

Player.propTypes = {
  classNames: PropTypes.string,
  isPlayerPage: PropTypes.bool,
};
