import { createPortal } from 'react-dom';
import backgroundImage from '../../assets/images/backgrounds/player-and-settings-page.png';
import musicCover from '../../assets/images/covers/no-cover.jpg';
import { ArrowDown2 } from 'iconsax-react';
import { Play, Next, Previous, RepeateOne, Shuffle } from 'iconsax-react';

function MobilePlayerPanel() {
  const isOpen = false;
  return createPortal(
    <div
      className={`fixed inset-0 overflow-y-auto transition-all duration-300 will-change-transform ${isOpen ? 'z-10 translate-y-0 opacity-100' : 'z-[-1] translate-y-full opacity-0'}`}
    >
      <div
        className="relative flex min-h-[100dvh] overflow-y-auto bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <button className="text-secondary-50 fixed top-3 left-3 z-[1] sm:top-5 sm:left-5 md:top-7 md:left-7 lg:hidden">
          <span className="block size-8 cursor-pointer md:size-10">
            <ArrowDown2 size="100%" />
          </span>
        </button>
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
              <div className="h-1 overflow-hidden rounded-full bg-white">
                <div className="h-full w-1/2 bg-blue-400"></div>
              </div>
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
      </div>
    </div>,
    document.getElementById('mobilePlayerPanel')
  );
}

export default MobilePlayerPanel;
