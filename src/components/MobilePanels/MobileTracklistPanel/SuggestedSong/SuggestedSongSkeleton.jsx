import ShimmerOverlay from '../../../ShimmerOverlay/ShimmerOverlay';

const SuggestedSongSkeleton = () => {
  return (
    <div className="relative flex items-center justify-between gap-2 overflow-hidden rounded-sm bg-gray-600/60">
      <ShimmerOverlay />
      <div className="flex grow items-center gap-2 overflow-hidden">
        <div className="relative h-15 w-15 min-w-15 overflow-hidden rounded-sm sm:size-17.5 sm:min-w-17.5">
          <div className="size-full bg-gray-800/50"></div>
        </div>
        <div className="flex grow flex-col gap-1.5 overflow-hidden p-1">
          <p className="h-3 w-3/4 rounded-full bg-gray-800/50 sm:w-1/2"></p>
          <p className="h-3 w-1/2 rounded-full bg-gray-800/50 sm:w-1/3"></p>
        </div>
      </div>

      <div className="me-2 min-h-8.5 min-w-8.5 rounded-md bg-gray-800/60 sm:min-h-10 sm:min-w-10"></div>
    </div>
  );
};

export default SuggestedSongSkeleton;
