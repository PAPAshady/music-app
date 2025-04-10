export default function ArtistCardSkeleton() {
  return (
    <div className="inline-flex animate-pulse flex-col items-center gap-5 rounded-lg bg-gray-600/60 py-4 inset-shadow-[2px_2px_6px_-1px] shadow-[4px_4px_8px_1px] shadow-[rgba(0,0,0,0.2)] inset-shadow-transparent transition-all duration-300 lg:py-5 lg:inset-shadow-[4px_4px_8px_1px] lg:hover:inset-shadow-[4px_4px_10px_1px] lg:hover:shadow-[rgba(0,0,0,0.4)] lg:hover:inset-shadow-[#A7BBE9]/29">
      <div className="px-6">
        <div className="size-[72px] overflow-hidden rounded-full bg-gray-800/60 lg:size-[120px]"></div>
      </div>

      <p className="text-white-50 flex w-[75%] max-w-[100px] items-center rounded-full bg-gray-800/60 px-3 py-1.5 text-center text-sm lg:max-w-[180px] lg:text-base"></p>
    </div>
  );
}
