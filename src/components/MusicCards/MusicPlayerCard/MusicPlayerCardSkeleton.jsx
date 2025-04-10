export default function MusicPlayerCardSkeleton() {
  return (
    <div className="border-secondary-300 bg-secondary-600/40 relative flex items-center gap-2 overflow-hidden rounded-lg border-2 p-2 backdrop-blur-xs transition-all duration-300">
      <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="hover:border-secondary-300 bg-secondary-400/50 size-24 cursor-pointer rounded-md border-2 border-transparent object-cover transition-colors duration-300"></div>
      <div className="visible grow overflow-hidden opacity-100 transition-all duration-300">
        <div className="mb-4">
          <h3 className="text-primary-50 bg-secondary-400/50 mb-3 h-2.5 w-[70%] cursor-pointer truncate rounded-full text-base"></h3>
          <p className="text-primary-100 bg-secondary-400/50 h-2.5 w-[40%] truncate rounded-full text-sm"></p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-primary-100 bg-secondary-400/50 h-2.5 w-[20%] rounded-full text-sm"></span>
          <span className="bg-secondary-400/50 rounded-md p-1 sm:size-6"></span>
        </div>
      </div>
    </div>
  );
}
