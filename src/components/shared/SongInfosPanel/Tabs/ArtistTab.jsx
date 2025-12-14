import SongCard from '../../../MusicCards/SongCard/SongCard';
import SongCardSkeleton from '../../../MusicCards/SongCard/SongCardSkeleton';
import usePlayBar from '../../../../hooks/usePlayBar';
import { getPopularSongsByArtistIdQueryOptions } from '../../../../queries/songs';
import defaultArtistCover from '../../../../assets/images/Avatar/no-avatar.png';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import ShimmerOverlay from '../../../ShimmerOverlay/ShimmerOverlay';

const MotionDiv = motion.div;

function ArtistTab({ artist, isPending, artistId }) {
  const { data: popularSongs, isPending: isPopularSongsPending } = useQuery(
    getPopularSongsByArtistIdQueryOptions(artistId)
  );
  const { playArtistSongs } = usePlayBar(artistId);

  return (
    <AnimatePresence mode="wait">
      <MotionDiv
        key={artistId}
        initial="initial"
        exit="exit"
        animate="animate"
        className="mt-4 flex-1 space-y-4 overflow-auto pr-2 pb-2"
        variants={{
          initial: { opacity: 0, y: 15 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 15 },
        }}
      >
        {isPending ? (
          <div>
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-full bg-gray-600/60">
                <ShimmerOverlay />
              </div>
              <div className="grow">
                <div className="relative mb-2 h-2 w-[60%] overflow-hidden rounded-full bg-gray-600/60">
                  <ShimmerOverlay />
                </div>
                <div className="relative h-2 w-1/2 overflow-hidden rounded-full bg-gray-600/60">
                  <ShimmerOverlay />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 ps-1 pt-3">
              <div className="relative h-2 w-[90%] overflow-hidden rounded-full bg-gray-600/60">
                <ShimmerOverlay />
              </div>
              <div className="relative h-2 w-[85%] overflow-hidden rounded-full bg-gray-600/60">
                <ShimmerOverlay />
              </div>
              <div className="relative h-2 w-[80%] overflow-hidden rounded-full bg-gray-600/60">
                <ShimmerOverlay />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <img
                src={artist?.image || defaultArtistCover}
                alt={artist?.name}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <div className="text-lg font-semibold">{artist?.name}</div>
                <div className="text-sm text-slate-300">Artist</div>
              </div>
            </div>

            <p className="text-sm text-slate-300">{artist?.bio}</p>
          </>
        )}

        <div>
          <div className="mb-2 text-sm text-slate-300">Top tracks</div>
          <div className="space-y-2">
            {isPopularSongsPending
              ? Array(5)
                  .fill()
                  .map((_, index) => <SongCardSkeleton key={index} />)
              : popularSongs?.map((song, index) => (
                  <SongCard key={song.id} song={song} index={index} onPlay={playArtistSongs} />
                ))}
          </div>
        </div>
      </MotionDiv>
    </AnimatePresence>
  );
}

ArtistTab.propTypes = {
  artist: PropTypes.object,
  isPending: PropTypes.bool.isRequired,
  artistId: PropTypes.string,
};

export default ArtistTab;
