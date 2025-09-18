import PlayBarSkeleton from '../../MusicCards/PlayBar/PlayBarSkeleton';
import { useSelector } from 'react-redux';
import noImage from '../../../assets/images/Avatar/no-avatar.png';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getPopularSongsByArtistIdQueryOptions } from '../../../queries/musics';
import { Music } from 'iconsax-react';
import useMediaQuery from '../../../hooks/useMediaQuery';
import usePlayBar from '../../../hooks/usePlayBar';
import defaultSongCover from '../../../assets/images/covers/no-cover.jpg';
import { formatTime } from '../../../redux/slices/musicPlayerSlice';
import PropTypes from 'prop-types';

function ArtistInfosPanel() {
  const selectedArtist = useSelector((state) => state.artist);
  const { data, isPending } = useQuery({
    ...getPopularSongsByArtistIdQueryOptions(selectedArtist.id),
    select: (data) => data.slice(0, 4),
  });
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
          <div className="grow">
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
                className={`flex h-full grow flex-col gap-2 pe-2 pt-[2px]`}
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
                  data.map((song, index) => (
                    <motion.div
                      key={song.id}
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        show: { opacity: 1, y: 0 },
                      }}
                    >
                      <Song song={song} index={index} onPlay={playArtistSongs} />
                      {/* <PlayBar size="sm" song={song} index={index} onPlay={playArtistSongs} /> */}
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
        </div>
      </div>
    </div>
  );
}

function Song({ song, index: songIndex, onPlay }) {
  const { id, cover, title, artist, duration } = song;
  return (
    <div
      key={id}
      className="ts-center flex cursor-pointer gap-3 rounded-md p-2 hover:bg-white/3"
      onClick={() => onPlay(song, songIndex)}
    >
      <img
        src={cover || defaultSongCover}
        alt="cover"
        className="h-12 w-12 rounded-md object-cover"
      />
      <div className="flex flex-1 flex-col justify-center gap-1">
        <div className="text-sm font-medium" title={title}>
          {title}
        </div>
        <div className="text-xs text-slate-300">{artist}</div>
      </div>
      <div className="text-sm text-slate-400">{formatTime(duration)}</div>
    </div>
  );
}

Song.propTypes = {
  song: PropTypes.object,
  index: PropTypes.number,
  onPlay: PropTypes.func,
};

export default ArtistInfosPanel;
