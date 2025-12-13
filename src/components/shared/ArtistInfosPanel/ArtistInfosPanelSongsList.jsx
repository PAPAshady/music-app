import SongCard from '../../MusicCards/SongCard/SongCard';
import SongCardSkeleton from '../../MusicCards/SongCard/SongCardSkeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getPopularSongsByArtistIdQueryOptions } from '../../../queries/musics';
import PropTypes from 'prop-types';
import usePlayBar from '../../../hooks/usePlayBar';

function ArtistInfosPanelSongsList({ artistId }) {
  const { data: popularSongs, isPending: isPopularSongsPending } = useQuery({
    ...getPopularSongsByArtistIdQueryOptions(artistId),
    select: (popularSongs) => popularSongs.slice(0, 4),
  });
  const { playArtistSongs } = usePlayBar(artistId);
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  return (
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
          className={`flex flex-col gap-2 pe-2 pt-0.5 ${!popularSongs?.length && 'h-full'}`}
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
  );
}

ArtistInfosPanelSongsList.propTypes = {
  artistId: PropTypes.string,
};

export default ArtistInfosPanelSongsList;
