import useCloseOnClickOutside from '../../../hooks/useCloseOnClickOutside ';
import { Pause, Next, Previous, RepeateOne, MusicFilter, Heart, VolumeHigh } from 'iconsax-react';
import IconButton from '../../Buttons/IconButton/IconButton';
import noCoverImg from '../../../assets/images/covers/no-cover.jpg';
import PropTypes from 'prop-types';

export default function Player({ classNames, isPlayerPage }) {
  const verticalVolumeSlider = useCloseOnClickOutside();

  return (
    <div
      className={`border-secondary-300 bg-secondary-700/64 xs:items-start xs:pt-4 xs:pb-3 group fixed bottom-0 left-0 z-10 flex w-full items-center gap-3 rounded-t-lg border-t px-3 pt-3 pb-2 backdrop-blur-sm min-[400px]:items-center min-[480px]:p-4 min-[1330px]:!w-[64dvw] sm:items-center sm:gap-4 lg:sticky lg:bottom-2 lg:justify-between lg:gap-8 lg:rounded-lg lg:border xl:w-[62.6dvw] xl:gap-4 2xl:!w-full ${classNames}`}
    >
      <div className="flex items-center gap-4">
        <div className="relative size-12 overflow-hidden rounded-lg min-[400px]:size-15 sm:size-20 lg:size-16">
          <img className="size-full object-cover" src={noCoverImg} alt="" />
          <div className="absolute top-0 flex size-full items-center justify-center bg-black/80 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button>
              <Heart size={28} />
            </button>
          </div>
        </div>
        <div className="hidden w-[170px] truncate lg:block xl:w-[200px]">
          <p className="text-white-50 truncate font-semibold">Ma Meilleure Ennemie</p>
          <p className="text-primary-100 truncate text-sm">Eminem</p>
        </div>
      </div>

      <div className="flex grow items-end gap-8">
        <div className="flex grow flex-col gap-2 min-[400px]:gap-3 lg:gap-4">
          <div className="flex items-center justify-between">
            <div className="lg:hidden">
              <p className="text-primary-50 xs:text-sm pb-1 text-xs min-[480px]:text-base sm:text-lg">
                Ma Meilleure Ennemie
              </p>
              <p className="text-primary-100 hidden sm:block">Eminem</p>
            </div>
            <span className="text-primary-100 hidden text-sm lg:block">01:29</span>
            <div className="xs:gap-5 flex items-center gap-4 min-[400px]:gap-6 sm:gap-10 lg:gap-12">
              <button className="xs:size-[18px] size-4 min-[480px]:size-5 sm:size-6">
                <Previous size="100%" />
              </button>
              <button className="xs:size-[18px] size-4 min-[480px]:size-5 sm:size-6">
                <Pause size="100%" />
              </button>
              <button className="xs:size-[18px] size-4 min-[480px]:size-5 sm:size-6">
                <Next size="100%" />
              </button>
            </div>
            <span className="text-primary-100 hidden text-sm lg:block">02:28</span>
          </div>

          <div className="border-primary-400 lg:border-primary-300 flex h-2 cursor-pointer items-center rounded-3xl border lg:h-2.5">
            <div className="bg-primary-400 border-primary-400 lg:bg-primary-300 lg:border-primary-300 inline h-2 w-1/2 rounded-3xl border lg:h-2.5"></div>
          </div>
        </div>
        <div className="ms-4 hidden items-center gap-4 lg:flex">
          <IconButton
            icon={<RepeateOne />}
            classNames={`hidden ${isPlayerPage ? 'lg:flex' : 'xl:flex'} `}
          />
          <IconButton icon={<MusicFilter />} classNames={isPlayerPage ? 'hidden' : 'xl:hidden'} />
          <div
            className="relative hidden items-center gap-2 lg:flex"
            ref={verticalVolumeSlider.ref}
          >
            <IconButton
              icon={<VolumeHigh />}
              onClick={() => verticalVolumeSlider.setIsVisible((prev) => !prev)}
            />
            {/* Horizantal volume slider */}
            <div
              className={`border-primary-400 hidden h-2 w-24 cursor-pointer overflow-hidden rounded-lg border ${isPlayerPage ? 'lg:block' : '2xl:block'} `}
            >
              <div className="bg-primary-400 h-full w-1/2 rounded-lg"></div>
            </div>
            {/* Vertical volume slider */}
            <div
              className={`bg-secondary-400/40 border-secondary-300 absolute left-1/2 flex w-8 -translate-x-1/2 justify-center rounded-xl border py-4 backdrop-blur-md transition-all duration-200 2xl:hidden ${!isPlayerPage && verticalVolumeSlider.isVisible ? 'visible bottom-[130%] opacity-100' : 'invisible bottom-full opacity-0'}`}
            >
              <div className="border-secondary-100 flex h-28 w-2.5 items-end overflow-hidden rounded-lg border">
                <div className="bg-secondary-100 h-1/2 w-full rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Player.propTypes = {
  classNames: PropTypes.string,
  isPlayerPage: PropTypes.bool,
};
