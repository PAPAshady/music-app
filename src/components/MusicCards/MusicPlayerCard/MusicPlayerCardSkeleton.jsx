import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';

export default function MusicPlayerCardSkeleton() {
  return (
    <div className="border-secondary-300 bg-secondary-600/40 relative flex items-center gap-2 overflow-hidden rounded-lg border-2 p-2 backdrop-blur-xs">
      <ShimmerOverlay />
      <div className="bg-secondary-400/50 size-24 rounded-md"></div>
      <div className="grow">
        <div className="mb-4">
          <h3 className="bg-secondary-400/50 mb-3 h-2.5 w-[70%] rounded-full"></h3>
          <p className="bg-secondary-400/50 h-2.5 w-[40%] rounded-full"></p>
        </div>
        <div className="flex items-center justify-between">
          <span className="bg-secondary-400/50 h-2.5 w-[20%] rounded-full"></span>
          <span className="bg-secondary-400/50 rounded-md p-1 sm:size-6"></span>
        </div>
      </div>
    </div>
  );
}
