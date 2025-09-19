import { useDispatch, useSelector } from 'react-redux';
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
import artistDefaultCover from '../../../assets/images/Avatar/no-avatar.png';
import { getRelatedArtistsByGenresQueryOptions } from '../../../queries/artists';
import PropTypes from 'prop-types';
import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';
import { setSelectedArtist } from '../../../redux/slices/artistSlice';
import { useEffect, useRef } from 'react';

function ArtistInfosPanel() {
  const selectedArtist = useSelector((state) => state.artist);
  const { data: popularSongs, isPending: isPopularSongsPending } = useQuery({
    ...getPopularSongsByArtistIdQueryOptions(selectedArtist.id),
    select: (popularSongs) => popularSongs.slice(0, 4),
  });
  const { data: albums, isPending: isAlbumsPending } = useQuery(
    getAlbumsByArtistIdQueryOptions(selectedArtist?.id)
  );
  const { data: relatedArtists, isPending: isRelatedArtistsPending } = useQuery(
    getRelatedArtistsByGenresQueryOptions(selectedArtist?.genres)
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
        <div className="flex h-full flex-col overflow-y-auto" ref={containerRef}>
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
                      .map((_, index) => <ArtistSekeleton key={index} />)
                  : relatedArtists.map((artist) => <Artist key={artist.id} {...artist} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Artist(artist) {
  const { image, name } = artist;
  const dispatch = useDispatch();

  return (
    <div
      className="group flex cursor-pointer flex-col items-center text-center"
      onClick={() => dispatch(setSelectedArtist(artist))}
    >
      <img
        src={image ?? artistDefaultCover}
        className="group-hover:outline-primary-50 mb-1 size-18 rounded-full object-cover outline-1 outline-transparent transition-colors"
      />
      <span className="text-sm">{name}</span>
    </div>
  );
}

function ArtistSekeleton() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-2 size-18 overflow-hidden rounded-full bg-gray-600/60">
        <ShimmerOverlay />
      </div>
      <span className="relative h-2 w-[60%] overflow-hidden rounded-full bg-gray-600/60">
        <ShimmerOverlay />
      </span>
    </div>
  );
}

Artist.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string,
};

export default ArtistInfosPanel;
