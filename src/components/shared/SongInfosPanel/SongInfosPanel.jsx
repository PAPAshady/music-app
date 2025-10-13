import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { Play, Pause, Heart, Menu } from 'iconsax-react';
import { useSelector } from 'react-redux';
import defaultSongCover from '../../../assets/images/covers/no-cover.jpg';
import defaultArtistCover from '../../../assets/images/Avatar/no-avatar.png';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getArtistByIdQueryOptions } from '../../../queries/artists';
import PlayBar from '../../MusicCards/PlayBar/PlayBar';
import PlayBarSkeleton from '../../MusicCards/PlayBar/PlayBarSkeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { likeSongMutationOptions, unlikeSongMutationOptions } from '../../../queries/likes';
import {
  getPopularSongsByArtistIdQueryOptions,
  getRelatedSongsBySongDataQueryOptions,
} from '../../../queries/musics';
import { Music } from 'iconsax-react';
import {
  formatTime,
  play,
  pause,
  setAutoLyricsTracker,
} from '../../../redux/slices/musicPlayerSlice';
import { useDispatch } from 'react-redux';
import usePlayBar from '../../../hooks/usePlayBar';
import SongCard from '../../MusicCards/SongCard/SongCard';
import SongCardSkeleton from '../../MusicCards/SongCard/SongCardSkeleton';
import useLyrics from '../../../hooks/useLyrics';
import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';
import { getSongByIdQueryOptions } from '../../../queries/musics';
import useQueryState from '../../../hooks/useQueryState';

function IconButton({ children, label, onClick, className = '', title, disabled }) {
  return (
    <button
      aria-label={label}
      title={title || label}
      onClick={onClick}
      disabled={disabled}
      className={
        'flex items-center justify-center rounded-lg p-2 transition hover:bg-white/6 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:outline-none ' +
        className
      }
    >
      {children}
    </button>
  );
}

function TabButton({ active, onClick, children, id }) {
  return (
    <button
      id={id}
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-sm font-medium transition ${
        active ? 'bg-white/8 text-white' : 'text-slate-300 hover:bg-white/2'
      }`}
    >
      {children}
    </button>
  );
}

export default function SongInfosPanel() {
  const songId = useQueryState().getQuery('id');
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('lyrics');
  const isPlaying = useSelector((state) => state.musicPlayer.isPlaying);
  const { data: song } = useQuery(getSongByIdQueryOptions(songId));
  const selectedSong = useSelector((state) => state.playContext.singleSong);
  const shouldAutoTrackLyrics = useSelector((state) => state.musicPlayer.autoLyricsTracker);
  const { data: artist, isPending: isArtistPending } = useQuery(
    getArtistByIdQueryOptions(song?.artist_id)
  );
  const { data: popularSongs, isPending: isPopularSongsPending } = useQuery(
    getPopularSongsByArtistIdQueryOptions(song?.artist_id)
  );
  const { data: relatedSongs, isPending: isRelatedSongsPending } = useQuery(
    getRelatedSongsBySongDataQueryOptions(selectedSong)
  );
  const { playTracklist, playArtistSongs } = usePlayBar(song?.artist_id);
  const lineRefs = useRef([]);
  const containerRef = useRef(null);
  const { currentLineIndex } = useLyrics(lineRefs, containerRef);
  const likeHandlerMutation = useMutation(
    song?.is_liked ? unlikeSongMutationOptions() : likeSongMutationOptions()
  );

  return (
    <div className="sticky top-10 hidden xl:block">
      <aside
        className={`border-secondary-200 flex h-[calc(100dvh-100px)] max-h-[700px] min-h-[430px] w-[270px] flex-col overflow-y-hidden rounded-xl border bg-gradient-to-b from-slate-700 to-slate-900 p-5 px-3 py-5 pb-4 text-white shadow-2xl xl:w-[310px] 2xl:h-[calc(100dvh-200px)]`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            key={song?.id}
            variants={{
              initial: { opacity: 0, y: 15 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 15 },
              transition: { duration: 0.2 },
            }}
          >
            <div className="flex items-center gap-4">
              <img
                src={song?.cover || defaultSongCover}
                alt={`${song?.title} cover`}
                className="h-20 w-20 rounded-md object-cover shadow-md"
              />
              <div className="flex-1">
                <h3 className="line-clamp-2 text-[22px] leading-tight font-semibold">
                  {song?.title}
                </h3>
                <button
                  className="mt-1 text-sm text-slate-300 hover:underline"
                  onClick={() => setActiveTab('artist')}
                >
                  {song?.artist}
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <IconButton
                onClick={() => dispatch(isPlaying ? pause() : play())}
                label={isPlaying ? 'Pause' : 'Play'}
                className="bg-white/6"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </IconButton>
              <IconButton
                label={song?.is_liked ? 'Unlike' : 'Like'}
                onClick={() => likeHandlerMutation.mutate(song?.id)}
                disabled={likeHandlerMutation.isPending}
              >
                <Heart
                  size={20}
                  className={`transition-colors ${song?.is_liked ? 'fill-secondary-50 text-secondary-50' : 'fill-transparent text-white'}`}
                />
              </IconButton>

              <IconButton label="More">
                <Menu size={20} />
              </IconButton>

              <div className="ml-auto text-sm text-slate-400">
                {formatTime(song?.duration)} • {song?.release_date?.split('-')[0]}
              </div>
            </div>
            {/* Tabs */}
            <div className="mt-5">
              <div role="tablist" aria-label="Song panels" className="flex gap-2">
                <TabButton
                  id="tab-lyrics"
                  active={activeTab === 'lyrics'}
                  onClick={() => setActiveTab('lyrics')}
                >
                  Lyrics
                </TabButton>
                <TabButton
                  id="tab-related"
                  active={activeTab === 'related'}
                  onClick={() => setActiveTab('related')}
                >
                  Related
                </TabButton>
                <TabButton
                  id="tab-artist"
                  active={activeTab === 'artist'}
                  onClick={() => setActiveTab('artist')}
                >
                  Artist
                </TabButton>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {activeTab === 'lyrics' && (
          <AnimatePresence mode="wait">
            <motion.div
              key={song?.id}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={{
                initial: { opacity: 0, y: 15 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 15 },
                transition: { duration: 0.6 },
              }}
              className="flex h-full grow flex-col overflow-hidden"
            >
              <div className="my-4 flex items-center justify-between">
                <div className="text-sm text-slate-300">Lyrics</div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      className="accent-indigo-400"
                      checked={shouldAutoTrackLyrics}
                      onChange={() => dispatch(setAutoLyricsTracker(!shouldAutoTrackLyrics))}
                    />
                    Auto-Sync
                  </label>
                </div>
              </div>
              <div className="h-full grow overflow-auto pr-2 pb-2" ref={containerRef}>
                {song?.lyrics ? (
                  <div className="space-y-4">
                    {song.lyrics.map((lyric, index) => (
                      <p
                        ref={(el) => (lineRefs.current[index] = el)}
                        key={index}
                        className={`leading-7 transition-all ${index === currentLineIndex ? 'font-semibold text-[#fff]' : 'text-slate-400'}`}
                      >
                        {lyric.text || '\u00A0'}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-neutral-400 text-center">
                    <Music size={55} className="text-secondary-300" />
                    <p className="mt-2 px-4 font-semibold text-white">
                      No lyrics available at the moment.
                    </p>
                    <p className="text-sm">Check back soon!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {activeTab === 'related' && (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSong.id}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={{
                initial: { opacity: 0, y: 15 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 15 },
                transition: { duration: 0.6 },
              }}
              className="mt-4 h-full space-y-4 overflow-auto pr-2 pb-2"
            >
              <div className="text-sm text-slate-300">Suggested & Queue</div>
              <motion.div
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{
                  show: {
                    transition: {
                      delayChildren: 0.1,
                      staggerChildren: 0.1,
                    },
                  },
                }}
                className="mt-2 space-y-3"
              >
                {isRelatedSongsPending
                  ? Array(10)
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
                  : relatedSongs.map((song, index) => (
                      <motion.div
                        key={song.id}
                        variants={{
                          hidden: { opacity: 0, y: 15 },
                          show: { opacity: 1, y: 0 },
                        }}
                      >
                        <PlayBar size="sm" onPlay={playTracklist} song={song} index={index} />
                      </motion.div>
                    ))}
              </motion.div>
              <button className="mt-3 w-full rounded-md bg-white/6 py-2 text-sm">Show more</button>
            </motion.div>
          </AnimatePresence>
        )}

        {activeTab === 'artist' && (
          <AnimatePresence mode="wait">
            <motion.div
              key={song?.artist_id}
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
              {isArtistPending ? (
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
                        <SongCard
                          key={song.id}
                          song={song}
                          index={index}
                          onPlay={playArtistSongs}
                        />
                      ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </aside>
    </div>
  );
}

IconButton.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool,
};

TabButton.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  id: PropTypes.string,
};
