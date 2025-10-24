import musicCover from '../../assets/images/covers/no-cover.jpg';
import { Play, Next, Previous, RepeateOne, Shuffle } from 'iconsax-react';
import PropTypes from 'prop-types';
import PlayerProgressBar from '../PlayerProgressBar/PlayerProgressBar';

function MobilePlayerPanel() {
  return (
    <div className="flex min-h-full grow flex-col items-center justify-center gap-8">
      <div className="flex w-full grow items-center justify-center pt-20">
        <div>
          <img
            src={musicCover}
            className="aspect-square w-[85vw] rounded-xl object-cover min-[500px]:max-w-[420px] min-[500px]:rounded-3xl sm:w-[70vw] sm:max-w-none md:max-w-[650px]"
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 px-4 text-start sm:w-[95%]">
        <div className="sm:mb-2">
          <p className="text-secondary-50 text-2xl font-bold sm:text-4xl">Music title</p>
          <p className="text-secondary-200 mt-1 text-sm sm:mt-4 sm:text-xl">Taylor Swift</p>
        </div>
        <div className="text-secondary-100">
          <PlayerProgressBar />
          <div className="mt-1 flex items-center justify-between text-xs">
            <span>0:00</span>
            <span>0:00</span>
          </div>
        </div>
        <div className="text-secondary-100 flex items-center justify-between sm:px-4">
          <button className="size-6 sm:size-8">
            <Shuffle size="100%" />
          </button>
          <button className="size-8 sm:size-10">
            <Previous size="100%" />
          </button>
          <button className="bg-secondary-50 flex size-16 items-center justify-center rounded-full text-black sm:size-20">
            <span className="block size-8 sm:size-10">
              <Play size="100%" />
            </span>
          </button>
          <button className="size-8 sm:size-10">
            <Next size="100%" />
          </button>
          <button className="size-6 sm:size-8">
            <RepeateOne size="100%" />
          </button>
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

MobilePlayerPanel.propTypes = {
  songs: PropTypes.array,
  isPending: PropTypes.bool,
};

export default MobilePlayerPanel;
