import PlayBarSkeleton from '../../MusicCards/PlayBar/PlayBarSkeleton';
import { useSelector } from 'react-redux';
import noImage from '../../../assets/images/Avatar/no-avatar.png';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getPopularSongsByArtistIdQueryOptions } from '../../../queries/musics';
import PlayBar from '../../MusicCards/PlayBar/PlayBar';
import { Music } from 'iconsax-react';

function ArtistInfosPanel() {
  const selectedArtist = useSelector((state) => state.artist);
  const { data, isPending } = useQuery(getPopularSongsByArtistIdQueryOptions(selectedArtist.id));

  return (
    <div className="sticky top-10 hidden xl:block">
      <div className="bg-secondary-400/40 border-secondary-200 flex h-[calc(100dvh-100px)] max-h-[700px] min-h-[430px] w-[270px] flex-col overflow-y-hidden rounded-xl border px-3 py-3 xl:w-[310px] 2xl:h-[calc(100dvh-200px)]">
        <span className="block text-center text-lg font-semibold">About Artist</span>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedArtist.id}
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
            <div className="mx-auto h-[190px] w-[190px] overflow-hidden p-3">
              <img
                src={selectedArtist.image || noImage}
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
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedArtist.id}
            variants={{
              show: {
                transition: {
                  delayChildren: 0.1,
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="show"
            exit="hidden"
            className={`flex grow flex-col gap-2 pe-2 pt-[2px] ${data?.length || isPending ? 'overflow-y-auto' : 'overflow-visible'}`}
          >
            {isPending ? (
              Array(10)
                .fill()
                .map((_, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      show: { opacity: 1, y: 0 },
                    }}
                  >
                    <PlayBarSkeleton size="sm" />
                  </motion.div>
                ))
            ) : data?.length ? (
              data.map((song) => (
                <motion.div
                  key={song.id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <PlayBar size="sm" {...song} />
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
                className="flex size-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-neutral-400 text-center"
              >
                <Music size={60} className="text-secondary-300" />
                <p className="mt-2 px-4 font-semibold text-white">
                  No songs available at the moment.
                </p>
                <p className="text-sm">Check back soon!</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ArtistInfosPanel;
