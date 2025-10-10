import noImage from '../../../assets/images/Avatar/no-avatar.png';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getPopularSongsByArtistIdQueryOptions } from '../../../queries/musics';
import usePlayBar from '../../../hooks/usePlayBar';
import SmallAlbumCard from '../../MusicCards/SmallAlbumCard/SmallAlbumCard';
import { getAlbumsByArtistIdQueryOptions } from '../../../queries/albums';
import SmallAlbumCardSkeleton from '../../MusicCards/SmallAlbumCard/SmallAlbumCardSkeleton';
import SongCard from '../../MusicCards/SongCard/SongCard';
import SongCardSkeleton from '../../MusicCards/SongCard/SongCardSkeleton';
import { getRelatedArtistsQueryOptions } from '../../../queries/artists';
import SmallArtistCardSkeleton from '../../MusicCards/SmallArtistCard/SmallArtistCardSkeleton';
import { useEffect, useRef } from 'react';
import SmallArtistCard from '../../MusicCards/SmallArtistCard/SmallArtistCard';
import useQueryState from '../../../hooks/useQueryState';
import { getArtistByIdQueryOptions } from '../../../queries/artists';
import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';

function ArtistInfosPanel() {
  const { getQuery } = useQueryState();
  const artistId = getQuery('id');
  const { data: selectedArtist, isPending } = useQuery(getArtistByIdQueryOptions(artistId));
  const { data: popularSongs, isPending: isPopularSongsPending } = useQuery({
    ...getPopularSongsByArtistIdQueryOptions(selectedArtist?.id),
    select: (popularSongs) => popularSongs.slice(0, 4),
  });
  const { data: albums, isPending: isAlbumsPending } = useQuery(
    getAlbumsByArtistIdQueryOptions(selectedArtist?.id)
  );
  const { data: relatedArtists, isPending: isRelatedArtistsPending } = useQuery(
    getRelatedArtistsQueryOptions(selectedArtist)
  );
  const { playArtistSongs } = usePlayBar(selectedArtist?.id);
  const containerRef = useRef();

  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  // always scroll to top when user clicked on another artist
  useEffect(() => {
    containerRef.current.scrollTop = 0;
  }, [selectedArtist]);

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
            <div>
              <p className="ps-3 pb-2 text-xl font-bold text-white">Popular</p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={artistId}
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
                  className={`flex flex-col gap-2 pe-2 pt-[2px] ${!popularSongs?.length && 'h-full'}`}
                >
                  {isPopularSongsPending ? (
                    Array(5)
                      .fill()
                      .map((_, index) => (
                        <motion.div key={index} variants={itemVariants}>
                          <SongCardSkeleton />
                        </motion.div>
                      ))
                  ) : popularSongs.length ? (
                    popularSongs.map((song, index) => (
                      <motion.div key={song.id} variants={itemVariants}>
                        <SongCard song={song} index={index} onPlay={playArtistSongs} />
                      </motion.div>
                    ))
                  ) : (
                    <p className="ps-2 pt-1 text-sm">No popular song found from this artist.</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="pe-2">
              <p className="ps-3 pb-3 text-xl font-bold text-white">Albums</p>
              <div className="flex flex-col gap-2">
                {isAlbumsPending ? (
                  Array(3)
                    .fill()
                    .map((_, index) => <SmallAlbumCardSkeleton key={index} />)
                ) : albums.length ? (
                  albums.map((album) => <SmallAlbumCard key={album.id} {...album} />)
                ) : (
                  <p className="ps-2 pt-1 text-sm">No albums found from this artist.</p>
                )}
              </div>
            </div>
            <div className="pe-2">
              <p className="ps-3 pb-3 text-xl font-bold text-white">Fans also like</p>
              <div className="grid grid-cols-3 gap-x-2 gap-y-4">
                {isRelatedArtistsPending
                  ? Array(6)
                      .fill()
                      .map((_, index) => <SmallArtistCardSkeleton key={index} size="sm" />)
                  : relatedArtists.map((artist) => (
                      <SmallArtistCard key={artist.id} size="sm" artist={artist} />
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistInfosPanel;
