import musicCover from '../../assets/images/covers/no-cover.jpg';
import { cloneElement, useEffect, useState } from 'react';
import {
  Play,
  Pause,
  Next,
  Previous,
  Shuffle,
  RepeateOne,
  RepeateMusic,
  Like1,
} from 'iconsax-react';
import PropTypes from 'prop-types';
import PlayerProgressBar from '../PlayerProgressBar/PlayerProgressBar';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getSongByIdQueryOptions } from '../../queries/musics';
import {
  formatTime,
  music,
  play,
  pause,
  next,
  prev,
  togglePlayState,
} from '../../redux/slices/musicPlayerSlice';
import { likeSongMutationOptions, unlikeSongMutationOptions } from '../../queries/likes';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ShimmerOverlay from '../ShimmerOverlay/ShimmerOverlay';

function MobilePlayerPanel() {
  const songId = useSelector((state) => state.queryState.id);
  const { data: song, isPending } = useQuery(getSongByIdQueryOptions(songId));
  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.musicPlayer.isPlaying);
  const currentMusic = useSelector((state) => state.musicPlayer.currentMusic);
  const likeHandlerMutation = useMutation(
    currentMusic?.is_liked ? unlikeSongMutationOptions() : likeSongMutationOptions()
  );
  const playingState = useSelector((state) => state.musicPlayer.playingState);

  const playButtons = [
    {
      id: 1,
      icon: <Like1 variant={song?.is_liked ? 'Bold' : 'Linear'} />,
      classNames: `size-6 sm:size-8 transition-colors duration-300 ${song?.is_liked ? 'text-primary-50 fill-primary-50' : ''}`,
      onClick: () => likeHandlerMutation.mutate(song?.id),
    },
    { id: 2, icon: <Previous />, classNames: 'size-8 sm:size-10', onClick: () => dispatch(prev()) },
    {
      id: 3,
      icon: isPlaying ? <Pause /> : <Play />,
      classNames: 'size-8 sm:size-10',
      onClick: () => dispatch(isPlaying ? pause() : play()),
    },
    { id: 4, icon: <Next />, classNames: 'size-8 sm:size-10', onClick: () => dispatch(next()) },
    {
      id: 5,
      icon:
        playingState === 'shuffle' ? (
          <Shuffle />
        ) : playingState === 'repeat_one' ? (
          <RepeateOne />
        ) : (
          <RepeateMusic />
        ),
      classNames: 'size-6 sm:size-8',
      onClick: () => dispatch(togglePlayState()),
    },
  ];

  return (
    <div className="flex min-h-full grow flex-col items-center justify-center gap-8">
      <div className="flex w-full grow items-center justify-center pt-20">
        <div className="relative overflow-hidden">
          <img
            src={song?.cover || musicCover}
            className="aspect-square w-[85vw] rounded-xl object-cover min-[500px]:max-w-[420px] min-[500px]:rounded-3xl sm:w-[70vw] sm:max-w-none md:max-w-[650px]"
            alt={song?.title}
          />
          <div
            className={`absolute inset-0 flex size-full items-center justify-center transition-opacity ${isPending ? 'opacity-100' : 'opacity-0'}`}
          >
            {isPending && <LoadingSpinner classNames="z-[1]" size="lg" />}
            <div className="absolute size-full bg-[#000]/50"></div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 px-4 text-start sm:w-[95%]">
        {isPending ? (
          <div className="sm:mb-2 flex gap-3 flex-col">
            <p className="relative bg-gray-600/60 h-3.5 w-2/3 overflow-hidden rounded-full">
              <ShimmerOverlay />
            </p>
            <p className="relative bg-gray-600/60 h-2.5 w-1/3 overflow-hidden rounded-full">
              <ShimmerOverlay />
            </p>
          </div>
        ) : (
          <div className="sm:mb-2">
            <p className="text-secondary-50 text-2xl font-bold sm:text-4xl">{song?.title}</p>
            <p className="text-secondary-200 mt-1 text-sm sm:mt-4 sm:text-xl">{song?.artist}</p>
          </div>
        )}
        <div className="text-secondary-100">
          <PlayerProgressBar />
          <div className="mt-3 flex items-center justify-between text-xs">
            <CurrentTimeNumber />
            <span className="text-primary-100 text-sm">{formatTime(currentMusic?.duration)}</span>
          </div>
        </div>
        <div className="text-secondary-100 flex items-center justify-between sm:px-4">
          {playButtons.map((button) => (
            <PlayButton key={button.id} {...button} />
          ))}
        </div>
        <div className="text-secondary-50 mt-2 flex items-center">
          <button className="grow cursor-pointer px-2 py-6 md:py-8 md:text-lg">UP NEXT</button>
          <button className="grow cursor-pointer px-2 py-6 md:py-8 md:text-lg">LYRICS</button>
          <button className="grow cursor-pointer px-2 py-6 md:py-8 md:text-lg">RELATED</button>
        </div>
      </div>
    </div>
  );
}

function PlayButton({ icon, onClick, classNames }) {
  const styledIcon = cloneElement(icon, { size: '100%' });
  return (
    <button className={classNames} onClick={onClick}>
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

  return <span className="text-primary-100 text-sm">{currentTime}</span>;
}

PlayButton.propTypes = {
  icon: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired,
  classNames: PropTypes.string,
};

MobilePlayerPanel.propTypes = {
  songs: PropTypes.array,
  isPending: PropTypes.bool,
};

export default MobilePlayerPanel;
