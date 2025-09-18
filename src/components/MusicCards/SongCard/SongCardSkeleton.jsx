import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';

function SongCardSkeleton() {
  return (
    <div className="relative flex gap-3 overflow-hidden rounded-md bg-gray-600/60 p-2">
      <ShimmerOverlay />
      <div className="size-12 rounded-md bg-gray-800/50"></div>
      <div className="flex flex-1 flex-col justify-center gap-2">
        <div className="h-2.5 w-2/3 rounded-full bg-gray-800/50"></div>
        <div className="h-2.5 w-1/2 rounded-full bg-gray-800/50"></div>
      </div>
      <div className="h-2.5 w-9 rounded-full bg-gray-800/50"></div>
    </div>
  );
}

export default SongCardSkeleton;
