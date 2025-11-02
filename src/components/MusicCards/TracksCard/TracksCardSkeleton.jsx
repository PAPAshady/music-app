import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';

function TracksCardSkeleton() {
  return (
    <div className="xs:h-[13dvw] relative h-[28dvw] w-full overflow-hidden rounded-lg bg-gray-600/60 lg:h-[8dvw] lg:max-h-[100px]">
      <ShimmerOverlay />
      <div className="flex size-full items-end justify-center sm:py-2 py-1.5 lg:justify-start lg:py-3 lg:ps-3.5">
        <div className="h-2 w-1/2 rounded-full bg-gray-800/60 sm:h-2.5"></div>
      </div>
    </div>
  );
}

export default TracksCardSkeleton;
