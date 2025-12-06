import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';

function PlaylistItemSkeleton() {
  return (
    <div className="relative flex items-center overflow-hidden rounded-md bg-gray-600/60 p-1.5">
      <ShimmerOverlay />
      <div className="flex grow items-center gap-2">
        <div className="size-8 rounded-sm bg-gray-800/50"></div>
        <span className="h-2 w-1/2 rounded-full bg-gray-800/50"></span>
      </div>
      <div className="size-5 rounded-sm bg-gray-800/50"></div>
    </div>
  );
}

export default PlaylistItemSkeleton;
