export default function NowPlayingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <div className="bg-secondary-50 animate-expand h-3 w-0.75 origin-bottom rounded-full"></div>
      <div className="bg-secondary-50 animate-expand h-3 w-0.75 origin-bottom rounded-full [animation-delay:250ms]"></div>
      <div className="bg-secondary-50 animate-expand h-3 w-0.75 origin-bottom rounded-full [animation-delay:450ms]"></div>
    </div>
  );
}
