import PropTypes from 'prop-types';
import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';

function SmallArtistCardSkeleton({ size }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`relative mb-2 overflow-hidden rounded-full bg-gray-600/60 ${size === 'sm' ? 'size-18' : 'size-24'}`}
      >
        <ShimmerOverlay />
      </div>
      <span
        className={`relative h-2 overflow-hidden rounded-full bg-gray-600/60 ${size === 'sm' ? 'w-[60%]' : 'w-[70%]'}`}
      >
        <ShimmerOverlay />
      </span>
    </div>
  );
}

SmallArtistCardSkeleton.propTypes = {
  size: PropTypes.oneOf(['sm', 'md']),
};

export default SmallArtistCardSkeleton;
