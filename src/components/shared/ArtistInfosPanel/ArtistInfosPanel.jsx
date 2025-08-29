import PlayBarSkeleton from '../../MusicCards/PlayBar/PlayBarSkeleton';
import { useSelector } from 'react-redux';
import noImage from '../../../assets/images/Avatar/no-avatar.png';

function ArtistInfosPanel() {
  const selectedArtist = useSelector((state) => state.artist);
  return (
    <div className="sticky top-10 hidden xl:block">
      <div className="bg-secondary-400/40 border-secondary-200 flex h-[calc(100dvh-100px)] max-h-[700px] min-h-[430px] w-[270px] flex-col overflow-y-hidden rounded-xl border px-3 py-3 xl:w-[310px] 2xl:h-[calc(100dvh-200px)]">
        <span className="block text-center text-lg font-semibold">About Artist</span>
        <div className="mx-auto min-h-[35%] w-[75%] overflow-hidden px-4 py-3">
          <img
            src={noImage}
            alt={selectedArtist.name}
            className="size-full rounded-2xl object-cover"
          />
        </div>
        <div className="h-full">
          <div className="mb-1 flex flex-col items-center gap-2 text-center">
            <div className="w-full overflow-hidden">
              <p
                className="text-secondary-100 truncate text-lg font-semibold"
                title={selectedArtist.full_name}
              >
                {selectedArtist.full_name}
              </p>
            </div>
            <p className="line-clamp-4 h-20 text-[13px]" title={selectedArtist.bio}>
              {selectedArtist.bio}
            </p>
          </div>
        </div>
        <div className="flex grow flex-col gap-2 overflow-y-auto pe-2 pt-[2px]">
          {Array(10)
            .fill()
            .map((_, index) => (
              <div key={index}>
                <PlayBarSkeleton size="sm" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ArtistInfosPanel;
