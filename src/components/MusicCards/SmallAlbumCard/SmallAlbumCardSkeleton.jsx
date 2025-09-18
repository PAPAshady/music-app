import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';

function SmallAlbumCardSkeleton() {
  return (
    <div className="relative flex items-center gap-2 overflow-hidden rounded-md bg-gray-600/60 p-2">
      <ShimmerOverlay />
      <div className="size-14 cursor-pointer rounded-md bg-gray-800/50 object-cover"></div>
      <div className="grow">
        <p className="mb-3 h-2.5 w-2/3 rounded-full bg-gray-800/50"></p>
        <p className="h-2.5 w-1/2 rounded-full bg-gray-800/50"></p>
      </div>
    </div>
  );
}
export default SmallAlbumCardSkeleton;
