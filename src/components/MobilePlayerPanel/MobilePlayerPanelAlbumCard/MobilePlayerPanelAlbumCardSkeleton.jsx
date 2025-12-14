import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';

function MobilePlayerPanelAlbumCardSkeleton() {
  return (
    <div className="flex w-37.5 flex-col rounded-xl p-3">
      <div className="relative mb-2 h-30 w-full overflow-hidden rounded-lg bg-gray-600/60">
        <ShimmerOverlay />
      </div>
      <div className="relative h-2 w-3/4 overflow-hidden rounded-full bg-gray-600/60">
        <ShimmerOverlay />
      </div>
      <div className="relative mt-1.5 h-1.5 w-2/3 overflow-hidden rounded-full bg-gray-600/60">
        <ShimmerOverlay />
      </div>
    </div>
  );
}

export default MobilePlayerPanelAlbumCardSkeleton;
