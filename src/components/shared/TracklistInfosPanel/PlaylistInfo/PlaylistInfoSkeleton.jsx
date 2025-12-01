import ShimmerOverlay from '../../../ShimmerOverlay/ShimmerOverlay';

function PlaylistInfoSkeleton() {
  return function PlaylistInfoSkeleton() {
    return (
      <div className="flex w-full grow items-center gap-1">
        <div className="relative size-[20px] min-h-[20px] min-w-[20px] overflow-hidden rounded-md bg-gray-600/60">
          <ShimmerOverlay />
        </div>
        {/* {styledIcon} */}
        <div className="relative w-full grow overflow-hidden rounded-full bg-gray-600/60">
          <ShimmerOverlay />
          <div className="h-2.5 w-1/2 max-w-[90px]"></div>
        </div>
      </div>
    );
  };
}



export default PlaylistInfoSkeleton;
