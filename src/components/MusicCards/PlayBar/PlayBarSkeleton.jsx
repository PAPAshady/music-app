import PropTypes from 'prop-types';
import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';

const PlayBarSkeleton = ({ size }) => {
  const albumNameSizes = {
    lg: 'lg:max-w-[250px] lg:w-[250px]',
    md: '',
    sm: '',
  };

  return (
    <div
      className={`relative flex max-w-[285px] items-center justify-between gap-4 overflow-hidden rounded-lg bg-gray-600/60 p-1.5 ${size === 'lg' ? 'lg:max-w-[890px]' : 'lg:max-w-[510px]'}`}
    >
      <ShimmerOverlay />
      <div
        className={`flex grow gap-2 overflow-hidden ${size === 'lg' ? 'lg:w-[270px] lg:max-w-[270px]' : ''}`}
      >
        <button className="relative size-14 min-h-14 min-w-14 overflow-hidden rounded-md">
          <div className="size-full bg-gray-800/60">image</div>
        </button>
        <div className="flex grow flex-col justify-center gap-2 overflow-hidden">
          <button className={`h-3 w-2/3 rounded-full bg-gray-800/50 ${size === 'md' ? '!w-6/7' : ''}`}></button>
          <span className={`h-3 w-1/2 rounded-full bg-gray-800/50`}></span>
        </div>
      </div>
      <div
        className={`flex items-center justify-between gap-4 pe-3 ${size !== 'sm' ? 'lg:grow-3' : ''}`}
      >
        {size !== 'sm' && (
          <>
            <p
              className={`hidden h-3 max-w-1/4 grow rounded-full bg-gray-800/50 lg:block ${albumNameSizes[size]}`}
            ></p>
            <span
              className={`h-3 w-1/7 rounded-full bg-gray-800/60 pe-3 lg:p-0 ${size !== 'lg' ? 'hidden lg:block' : ''}`}
            ></span>
          </>
        )}
        <div className={`flex items-center gap-2 ${size !== 'sm' ? 'lg:gap-4' : ''}`}>
          <div className={` ${size === 'md' ? 'block lg:hidden' : 'block'}`}>
            <div className="size-7 rounded-md bg-gray-800/60 p-1"></div>
          </div>
          <div
            className={`${size === 'md' ? 'hidden lg:block' : ''} ${size === 'sm' ? 'hidden lg:block' : ''}`}
          >
            <div className="relative">
              <div className="rounded-md bg-gray-800/60 p-1 sm:size-7"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PlayBarSkeleton.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']).isRequired,
};

export default PlayBarSkeleton;
