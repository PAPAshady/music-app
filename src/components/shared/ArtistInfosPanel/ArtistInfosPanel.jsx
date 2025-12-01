import noImage from '../../../assets/images/Avatar/no-avatar.png';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getArtistByIdQueryOptions } from '../../../queries/artists';
import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';
import ErrorPanel from '../ErrorPanel/ErrorPanel';
import ArtistInfosPanelSongsList from './ArtistInfosPanelSongsList';
import ArtistInfosPanelAlbumsList from './ArtistInfosPanelAlbumsList';
import ArtistInfosPanelArtistsList from './ArtistInfosPanelArtistsList';

function ArtistInfosPanel() {
  const artistId = useSelector((state) => state.queryState.id);
  const {
    data: selectedArtist,
    isPending,
    isError,
    failureReason,
    error,
  } = useQuery(getArtistByIdQueryOptions(artistId));
  const containerRef = useRef();
  const showErrorPanel =
    failureReason?.code === '22P02' || failureReason?.code === 'PGRST116' || isError;

  // always scroll to top when user clicked on another artist
  useEffect(() => {
    containerRef.current.scrollTop = 0;
  }, [selectedArtist]);

  if (showErrorPanel) return <ErrorPanel error={error} />;

  return (
    <div className="sticky top-10 hidden xl:block">
      <div className="border-secondary-200 flex h-[calc(100dvh-100px)] max-h-[700px] min-h-[430px] w-[270px] flex-col rounded-xl border bg-gradient-to-b from-slate-700 to-slate-900 px-3 py-5 xl:w-[310px] 2xl:h-[calc(100dvh-200px)]">
        <div className="flex h-full flex-col overflow-y-auto scroll-smooth" ref={containerRef}>
          <div>
            <span className="block text-center text-lg font-semibold">About Artist</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={artistId}
                variants={{
                  initial: { opacity: 0, y: 15 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: 15 },
                  transition: { duration: 0.2 },
                }}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                {isPending ? (
                  <div className="mx-auto h-[190px] w-[190px] p-3">
                    <div className="relative size-full overflow-hidden rounded-2xl bg-gray-600/60">
                      <ShimmerOverlay />
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto h-[190px] w-[190px] overflow-hidden p-3">
                    <img
                      src={selectedArtist.image || noImage}
                      alt={selectedArtist.name}
                      className="size-full rounded-2xl object-cover"
                    />
                  </div>
                )}
                <div className="h-full px-2">
                  <div className="mb-4 flex flex-col items-center gap-2 text-center">
                    {isPending ? (
                      <>
                        <div className="relative mt-1 mb-2 h-3 w-1/2 overflow-hidden rounded-full bg-gray-600/60">
                          <ShimmerOverlay />
                        </div>
                        <div className="relative mt-0.5 h-2 w-3/4 overflow-hidden rounded-full bg-gray-600/60">
                          <ShimmerOverlay />
                        </div>
                        <div className="relative mt-0.5 h-2 w-2/3 overflow-hidden rounded-full bg-gray-600/60">
                          <ShimmerOverlay />
                        </div>
                        <div className="relative mt-0.5 h-2 w-4/5 overflow-hidden rounded-full bg-gray-600/60">
                          <ShimmerOverlay />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-full overflow-hidden">
                          <p
                            className="text-secondary-100 truncate text-lg font-semibold"
                            title={selectedArtist?.full_name}
                          >
                            {selectedArtist?.full_name}
                          </p>
                        </div>
                        <p className="text-[13px]" title={selectedArtist?.bio}>
                          {selectedArtist?.bio}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 flex grow flex-col gap-6">
            <ArtistInfosPanelSongsList artistId={selectedArtist?.id} />
            <ArtistInfosPanelAlbumsList artistId={selectedArtist?.id} />
            <ArtistInfosPanelArtistsList artist={selectedArtist} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistInfosPanel;
