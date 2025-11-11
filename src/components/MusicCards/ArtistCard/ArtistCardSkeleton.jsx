import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';

export default function ArtistCardSkeleton() {
  return (
    <div className="relative inline-flex flex-col items-center gap-5 overflow-hidden rounded-lg bg-gray-600/60 py-4 inset-shadow-[2px_2px_6px_-1px] shadow-[4px_4px_8px_1px] shadow-[rgba(0,0,0,0.2)] inset-shadow-transparent transition-all duration-300 lg:py-5 lg:inset-shadow-[4px_4px_8px_1px] lg:hover:inset-shadow-[4px_4px_10px_1px] lg:hover:shadow-[rgba(0,0,0,0.4)] lg:hover:inset-shadow-[#A7BBE9]/29">
      <ShimmerOverlay />
      <div className="px-6">
        <div className="size-[100px] rounded-full bg-gray-800/60 lg:size-[120px]"></div>
      </div>

      <p className="w-[75%] mt-2 max-w-[100px] rounded-full bg-gray-800/60 px-3 py-1.5 lg:max-w-[180px]"></p>
    </div>
  );
}
