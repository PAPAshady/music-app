import PropTypes from 'prop-types';
import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';

const PlayBarSkeleton = ({ size, classNames }) => {
  return (
    <div
      className={`relative flex max-w-71.25 items-center justify-between gap-4 overflow-hidden rounded-lg bg-gray-600/60 p-1.5 ${size === 'lg' ? 'lg:max-w-222.5' : 'lg:max-w-127.5'} ${classNames}`}
    >
      <ShimmerOverlay />
      <div className={`flex gap-2 overflow-hidden ${size === 'md' ? 'grow-2' : 'grow-2'}`}>
        <button className="relative size-14 min-h-14 min-w-14 overflow-hidden rounded-md">
          <div className="size-full bg-gray-800/60"></div>
        </button>

        <div
          className={`flex w-full flex-col justify-center gap-2 overflow-hidden ${size === 'lg' ? 'grow-3' : 'grow'}`}
        >
          <button className={`h-3 w-2/3 rounded-full bg-gray-800/50`}></button>
          <span className={`h-3 w-1/2 rounded-full bg-gray-800/50`}></span>
        </div>
      </div>

      <div
        className={`flex items-center gap-8 pe-3 ${size === 'md' ? 'justify-between lg:grow-2' : 'justify-end'} ${size === 'lg' ? 'lg:grow-3 lg:justify-between' : ''}`}
      >
        {size !== 'sm' && (
          <p
            className={`hidden h-3 rounded-full bg-gray-800/50 lg:block ${size === 'lg' ? 'lg:w-1/5' : 'w-2/4'}`}
          ></p>
        )}
        <div className={`flex items-center gap-2 ${size !== 'sm' ? 'lg:gap-4' : ''}`}>
          <div className="block size-7 rounded-md bg-gray-800/60 p-1"></div>
          <div
            className={`size-7 rounded-md bg-gray-800/60 p-1 ${size === 'sm' ? 'hidden lg:block' : size === 'md' ? 'hidden' : 'block'}`}
          ></div>
        </div>
      </div>
    </div>
  );
};

PlayBarSkeleton.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']).isRequired,
  classNames: PropTypes.string,
};

export default PlayBarSkeleton;
