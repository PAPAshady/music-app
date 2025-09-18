import { useSelector } from 'react-redux';
import noImage from '../../../assets/images/Avatar/no-avatar.png';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getPopularSongsByArtistIdQueryOptions } from '../../../queries/musics';
import { Music } from 'iconsax-react';
import useMediaQuery from '../../../hooks/useMediaQuery';
import usePlayBar from '../../../hooks/usePlayBar';
import SmallAlbumCard from '../../MusicCards/SmallAlbumCard/SmallAlbumCard';
import { getAlbumsByArtistIdQueryOptions } from '../../../queries/albums';
import SmallAlbumCardSkeleton from '../../MusicCards/SmallAlbumCard/SmallAlbumCardSkeleton';
import SongCard from '../../MusicCards/SongCard/SongCard';
import SongCardSkeleton from '../../MusicCards/SongCard/SongCardSkeleton';

function ArtistInfosPanel() {
  const selectedArtist = useSelector((state) => state.artist);
  const { data, isPending } = useQuery({
    ...getPopularSongsByArtistIdQueryOptions(selectedArtist.id),
    select: (data) => data.slice(0, 4),
  });
  const { data: albums, isPending: isAlbumsPending } = useQuery(
    getAlbumsByArtistIdQueryOptions(selectedArtist?.id)
  );
  const isLargeDesktop = useMediaQuery('(min-width: 1400px)');
  const { playArtistSongs } = usePlayBar(selectedArtist?.id);

  return (
    <div className="sticky top-10 hidden xl:block">
      <div className="border-secondary-200 flex h-[calc(100dvh-100px)] max-h-[700px] min-h-[430px] w-[270px] flex-col rounded-xl border bg-gradient-to-b from-slate-700 to-slate-900 px-3 py-5 xl:w-[310px] 2xl:h-[calc(100dvh-200px)]">
        <div className="flex h-full flex-col overflow-y-auto">
          <div>
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
                <div className="h-full px-2">
                  <div className="mb-4 flex flex-col items-center gap-2 text-center">
                    <div className="w-full overflow-hidden">
                      <p
                        className="text-secondary-100 truncate text-lg font-semibold"
                        title={selectedArtist.full_name}
                      >
                        {selectedArtist.full_name}
                      </p>
                    </div>
                    <p className="text-[13px]" title={selectedArtist.bio}>
                      {selectedArtist.bio}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 flex grow flex-col gap-6">
            <div>
              <p className="ps-3 pb-2 text-xl font-bold text-white">Popular</p>

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
                  className={`flex flex-col gap-2 pe-2 pt-[2px] ${!data?.length && 'h-full'}`}
                >
                  {isPending ? (
                    Array(5)
                      .fill()
                      .map((_, index) => (
                        <motion.div
                          key={index}
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            show: { opacity: 1, y: 0 },
                          }}
                        >
                          <SongCardSkeleton />
                        </motion.div>
                      ))
                  ) : data?.length ? (
                    data.map((song, index) => (
                      <motion.div
                        key={song.id}
                        variants={{
                          hidden: { opacity: 0, y: 15 },
                          show: { opacity: 1, y: 0 },
                        }}
                      >
                        <SongCard song={song} index={index} onPlay={playArtistSongs} />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
                      className="flex size-full grow flex-col items-center justify-center gap-1 rounded-md border border-dashed border-neutral-400 p-4 text-center"
                    >
                      <Music size={isLargeDesktop ? 60 : 52} className="text-secondary-300" />
                      <p className="mt-2 px-4 font-semibold text-white">
                        No songs available at the moment.
                      </p>
                      <p className="text-sm">Check back soon!</p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="pe-2">
              <p className="ps-3 pb-3 text-xl font-bold text-white">Albums</p>
              <div className="flex flex-col gap-2">
                {isAlbumsPending
                  ? Array(3)
                      .fill()
                      .map((_, index) => <SmallAlbumCardSkeleton key={index} />)
                  : albums.map((album) => <SmallAlbumCard key={album.id} {...album} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistInfosPanel;
