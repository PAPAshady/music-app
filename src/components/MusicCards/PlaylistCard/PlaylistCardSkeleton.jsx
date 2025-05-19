import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';

export default function PlaylistCardSkeleton() {
  return (
    <div className="group relative flex h-36 min-w-36 items-center justify-center overflow-hidden rounded-lg bg-gray-600/60 shadow-[2px_2px_15px_rgba(0,0,0,0.5)] lg:h-48 lg:min-w-[152px] xl:min-w-[140px]">
      <ShimmerOverlay />
      <div className="flex size-full flex-col justify-between p-2">
        <div className="p-1 text-end">
          <button className="size-6 rounded-xs bg-gray-800/50"></button>
        </div>
        <div>
          <h3 className="mb-2 h-3 w-4/6 rounded-full bg-gray-800/50"></h3>
          <p className="mb-2 h-3 w-6/7 rounded-full bg-gray-800/50"></p>
        </div>
      </div>
    </div>
  );
}
