import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';

const PlaylistSongSkeleton = () => {
  return (
    <div className="relative flex items-center justify-between gap-2 overflow-hidden rounded-sm bg-gray-600/60 py-1 ps-1">
      <ShimmerOverlay />
      <div className="flex grow items-center gap-2 overflow-hidden">
        <div className="size-11.25 min-w-11.25 rounded-sm bg-gray-800/50"></div>
        <div className="flex grow flex-col gap-1">
          <p className="h-2 w-1/2 rounded-full bg-gray-800/50"></p>
          <p className="h-2 w-1/3 rounded-full bg-gray-800/50"></p>
        </div>
      </div>

      <div className="me-2 min-h-6 min-w-6 rounded-md bg-gray-800/50"></div>
    </div>
  );
};

export default PlaylistSongSkeleton;
