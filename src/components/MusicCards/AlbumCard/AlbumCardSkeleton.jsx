import PropTypes from 'prop-types';
import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';

export default function AlbumCardSkeleton({ size, classNames }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg bg-gray-600/60 shadow-[1px_1px_8px_rgba(0,0,0,.5)] ${size === 'md' && 'lg:max-w-82'} ${classNames}`}
    >
      <ShimmerOverlay />
      <div className="flex items-center lg:p-3">
        <div className="size-21.25 min-h-21.25 min-w-21.25 rounded-sm bg-gray-800/50"></div>
        <div className="flex grow items-center justify-between px-3.5 lg:block">
          <div className="w-full">
            <p className="mb-4 h-2.5 w-[65%] rounded-full bg-gray-800/50"></p>
            <span className="block h-2.5 w-[40%] rounded-full bg-gray-800/50"></span>
          </div>
          {size === 'md' && (
            <div className="mt-3 hidden items-center justify-between gap-4 lg:flex">
              <p className="flex items-center gap-2">
                <span className="size-3.5 rounded-xs bg-gray-800/50"></span>
                <span className="h-2 w-10 rounded-full bg-gray-800/50"></span>
              </p>
              <div className="flex items-center gap-2">
                <span className="size-4 rounded-xs bg-gray-800/50"></span>
                <span className="size-4 rounded-xs bg-gray-800/50"></span>
              </div>
            </div>
          )}
          <span className="size-6 rounded-sm bg-gray-800/50 lg:hidden"></span>
        </div>
      </div>
      {size === 'lg' && (
        <button className="absolute top-3 right-3 hidden size-6 rounded-sm bg-gray-800/50 lg:block"></button>
      )}
    </div>
  );
}

AlbumCardSkeleton.propTypes = {
  size: PropTypes.oneOf(['md', 'lg']).isRequired,
  classNames: PropTypes.string,
};
