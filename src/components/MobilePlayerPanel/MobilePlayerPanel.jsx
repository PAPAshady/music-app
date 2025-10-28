import musicCover from '../../assets/images/covers/no-cover.jpg';
import { cloneElement, useEffect, useState, useRef } from 'react';
import {
  Play,
  Pause,
  Next,
  Previous,
  Shuffle,
  RepeateOne,
  RepeateMusic,
  Like1,
  Music,
} from 'iconsax-react';
import PropTypes from 'prop-types';
import PlayerProgressBar from '../PlayerProgressBar/PlayerProgressBar';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getSongByIdQueryOptions } from '../../queries/musics';
import {
  formatTime,
  music,
  play,
  pause,
  next,
  prev,
  togglePlayState,
} from '../../redux/slices/musicPlayerSlice';
import { likeSongMutationOptions, unlikeSongMutationOptions } from '../../queries/likes';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ShimmerOverlay from '../ShimmerOverlay/ShimmerOverlay';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import SongCard from '../MusicCards/SongCard/SongCard';
import SongCardSkeleton from '../MusicCards/SongCard/SongCardSkeleton';
import { chunkArray } from '../../utils/arrayUtils';
import { getRelatedSongsBySongDataQueryOptions } from '../../queries/musics';
import { getRelatedArtistsQueryOptions } from '../../queries/artists';
import { getArtistByIdQueryOptions } from '../../queries/artists';
import SmallArtistCard from '../MusicCards/SmallArtistCard/SmallArtistCard';
import SmallArtistCardSkeleton from '../MusicCards/SmallArtistCard/SmallArtistCardSkeleton';
import { getAlbumsByArtistIdQueryOptions } from '../../queries/albums';
import useLyrics from '../../hooks/useLyrics';
import { setAutoLyricsTracker } from '../../redux/slices/musicPlayerSlice';
import usePlayBar from '../../hooks/usePlayBar';
import { closePanel as closePlayerPanel } from '../../redux/slices/playerPanelSlice';
import { setSelectedCollection } from '../../redux/slices/playContextSlice';
import { setQueries } from '../../redux/slices/queryStateSlice';
import { openMobilePanel } from '../../redux/slices/mobilePanelSlice';

function MobilePlayerPanel() {
  const songId = useSelector((state) => state.queryState.id);
  const { data: song, isPending } = useQuery(getSongByIdQueryOptions(songId));
  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.musicPlayer.isPlaying);
  const likeHandlerMutation = useMutation(
    song?.is_liked ? unlikeSongMutationOptions() : likeSongMutationOptions()
  );
  const containerRef = useRef(null);
  const lineRefs = useRef([]);
  const { currentLineIndex } = useLyrics(lineRefs, containerRef);
  const playingState = useSelector((state) => state.musicPlayer.playingState);
  const { data: relatedSongs, isPending: isRelatedSongsPending } = useQuery(
    getRelatedSongsBySongDataQueryOptions(song)
  );
  const { data: artist } = useQuery(getArtistByIdQueryOptions(song?.artist_id));
  const { data: relatedArtists, isPending: isRelatedArtistsPending } = useQuery(
    getRelatedArtistsQueryOptions(artist)
  );
  const { data: albums, isPending: isAlbumsPending } = useQuery(
    getAlbumsByArtistIdQueryOptions(song?.artist_id)
  );
  const [tab, setTab] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const shouldAutoTrackLyrics = useSelector((state) => state.musicPlayer.autoLyricsTracker);
  const { playSingleSong } = usePlayBar();

  const closePanel = () => {
    setTab(null);
    setIsPanelOpen(false);
  };

  const playButtons = [
    {
      id: 1,
      icon: <Like1 variant={song?.is_liked ? 'Bold' : 'Linear'} />,
      classNames: `size-8 sm:size-10 transition-colors duration-300 ${song?.is_liked ? 'text-primary-50 fill-primary-50' : ''}`,
      onClick: () => likeHandlerMutation.mutate(song?.id),
    },
    { id: 2, icon: <Previous />, classNames: 'size-8 sm:size-10', onClick: () => dispatch(prev()) },
    {
      id: 3,
      icon: isPlaying ? <Pause /> : <Play />,
      classNames: 'size-10 sm:size-12',
      onClick: () => dispatch(isPlaying ? pause() : play()),
    },
    { id: 4, icon: <Next />, classNames: 'size-8 sm:size-10', onClick: () => dispatch(next()) },
    {
      id: 5,
      icon:
        playingState === 'shuffle' ? (
          <Shuffle />
        ) : playingState === 'repeat_one' ? (
          <RepeateOne />
        ) : (
          <RepeateMusic />
        ),
      classNames: 'size-8 sm:size-10',
      onClick: () => dispatch(togglePlayState()),
    },
  ];

  const tabButtons = [
    { id: 1, title: 'UP NEXT' },
    { id: 2, title: 'LYRICS' },
    { id: 3, title: 'RELATED' },
  ];

  return (
    <div className="relative flex min-h-full grow flex-col items-center justify-center gap-8">
      <div className="flex w-full grow items-center justify-center pt-20">
        <div className="relative overflow-hidden">
          <img
            src={song?.cover || musicCover}
            className="aspect-square w-[85vw] rounded-xl object-cover min-[500px]:max-w-[420px] min-[500px]:rounded-3xl sm:w-[70vw] sm:max-w-none md:max-w-[650px]"
            alt={song?.title}
          />
          <div
            className={`absolute inset-0 flex size-full items-center justify-center transition-opacity ${isPending ? 'opacity-100' : 'opacity-0'}`}
          >
            {isPending && <LoadingSpinner classNames="z-[1]" size="lg" />}
            <div className="absolute size-full bg-[#000]/50"></div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 px-4 pb-20 text-start sm:w-[95%]">
        {isPending ? (
          <div className="flex flex-col gap-3 sm:mb-2">
            <p className="relative h-3.5 w-2/3 overflow-hidden rounded-full bg-gray-600/60">
              <ShimmerOverlay />
            </p>
            <p className="relative h-2.5 w-1/3 overflow-hidden rounded-full bg-gray-600/60">
              <ShimmerOverlay />
            </p>
          </div>
        ) : (
          <div className="sm:mb-2">
            <p className="text-secondary-50 text-2xl font-bold sm:text-4xl">{song?.title}</p>
            <p className="text-secondary-200 mt-1 text-sm sm:mt-4 sm:text-xl">{song?.artist}</p>
          </div>
        )}
        <div className="text-secondary-100">
          <PlayerProgressBar />
          <div className="mt-3 flex items-center justify-between text-xs">
            <CurrentTimeNumber />
            <span className="text-primary-100 text-sm">{formatTime(song?.duration || 0)}</span>
          </div>
        </div>
        <div className="text-secondary-100 flex items-center justify-between px-2 min-[380px]:px-4">
          {playButtons.map((button) => (
            <PlayButton key={button.id} {...button} />
          ))}
        </div>
      </div>
      <div
        className={`text-secondary-50 absolute bottom-0 flex w-full flex-col overflow-hidden transition-all transition-discrete duration-300 ${isPanelOpen ? 'z-[1] h-full bg-slate-800' : 'h-14 bg-transparent'}`}
      >
        <div>
          {isPanelOpen && (
            <div className="bg-secondary-800/50 flex origin-top items-center p-2">
              <div className="flex grow items-center gap-2" onClick={closePanel}>
                {isPending ? (
                  <>
                    <div className="relative size-11 overflow-hidden rounded-lg bg-gray-600/60">
                      <ShimmerOverlay />
                    </div>
                    <div className="flex grow flex-col gap-2">
                      <div className="relative h-2 w-1/2 overflow-hidden rounded-full bg-gray-600/60">
                        <ShimmerOverlay />
                      </div>
                      <div className="relative h-2 w-1/3 overflow-hidden rounded-full bg-gray-600/60">
                        <ShimmerOverlay />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={song?.cover || musicCover}
                      alt={song?.title}
                      className="size-11 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold">{song?.title}</p>
                      <p className="text-xs text-slate-300">{song?.artist}</p>
                    </div>
                  </>
                )}
              </div>
              <button onClick={() => dispatch(isPlaying ? pause() : play())} className="px-3 py-2">
                {isPlaying ? <Pause /> : <Play />}
              </button>
            </div>
          )}
          <div onClick={() => setIsPanelOpen(true)}>
            <div className="border-secondary-300 flex items-center border-b">
              {tabButtons.map((button) => (
                <TabButton
                  key={button.id}
                  {...button}
                  onClick={setTab}
                  isActive={tab === button.title}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className={`overflow-y-auto p-4 transition-opacity duration-300 ${isPanelOpen ? 'opacity-100' : 'opacity-0'}`}
        >
          {tab === 'RELATED' && (
            <>
              <h2 className="mb-3 text-xl font-bold">You might also like</h2>
              <Swiper spaceBetween={16} slidesPerView={1.15}>
                {isRelatedSongsPending
                  ? chunkArray(Array(12).fill(), 4).map((skeletonCardsArray, index) => (
                      <SwiperSlide key={index}>
                        <div className="flex flex-col gap-4">
                          {skeletonCardsArray.map((_, index) => (
                            <SongCardSkeleton key={index} />
                          ))}
                        </div>
                      </SwiperSlide>
                    ))
                  : chunkArray(relatedSongs || [], 4).map((songsArray, index) => (
                      <SwiperSlide key={index}>
                        <div className="flex flex-col gap-2">
                          {songsArray.map((song) => (
                            <SongCard
                              key={song.id}
                              song={song}
                              onPlay={playSingleSong}
                              classNames="!border-none !text-white"
                            />
                          ))}
                        </div>
                      </SwiperSlide>
                    ))}
              </Swiper>

              {/* Similar artists */}
              <h2 className="mt-6 mb-4 text-xl font-bold">Similar artists</h2>
              <Swiper slidesPerView={2.5}>
                {isRelatedArtistsPending
                  ? Array(6)
                      .fill()
                      .map((_, index) => (
                        <SwiperSlide key={index}>
                          <SmallArtistCardSkeleton key={index} />
                        </SwiperSlide>
                      ))
                  : relatedArtists.map((artist) => (
                      <SwiperSlide key={artist.id}>
                        <SmallArtistCard
                          artist={artist}
                          size="md"
                          onClick={() => dispatch(closePlayerPanel())} // close player panel before opening artist panel
                        />
                      </SwiperSlide>
                    ))}
              </Swiper>

              <h2 className="mt-6 mb-4 text-xl font-bold">More from this artist</h2>
              <Swiper spaceBetween={12} slidesPerView={2.3}>
                {isAlbumsPending
                  ? Array(6)
                      .fill()
                      .map((_, index) => (
                        <SwiperSlide key={index}>
                          <SmallAlbumCardSkeleton />
                        </SwiperSlide>
                      ))
                  : albums.map((album, i) => (
                      <SwiperSlide key={i}>
                        <SmallAlbumCard {...album} />
                      </SwiperSlide>
                    ))}
              </Swiper>

              <h2 className="mt-6 mb-4 text-xl font-bold">Song details</h2>
              <div className="flex items-center gap-3">
                <div className="size-24 overflow-hidden rounded-xl">
                  <img src={song?.cover} alt={song?.title} className="size-full object-cover" />
                </div>
                <div className="flex grow flex-col gap-1">
                  <p className="font-bold">{song?.title}</p>
                  <p className="text-sm text-slate-300">
                    {song?.artist} - {formatTime(song?.duration)}
                  </p>
                  <p className="text-sm">
                    {song?.album} - {song?.release_date.split('-')[0]}
                  </p>
                </div>
              </div>
            </>
          )}

          {tab === 'LYRICS' && (
            <div className="flex h-full flex-col">
              <div className="border-secondary-400 mb-6 flex items-center justify-between border-b pt-2 pb-4">
                <h2 className="text-xl font-bold">Lyrics</h2>
                <label className="flex items-center gap-2">
                  <span>Auto-sync</span>
                  <input
                    type="checkbox"
                    checked={shouldAutoTrackLyrics}
                    onChange={() => dispatch(setAutoLyricsTracker(!shouldAutoTrackLyrics))}
                  />
                </label>
              </div>

              <div className="h-full grow overflow-auto pr-2 pb-2" ref={containerRef}>
                {song?.lyrics ? (
                  <div className="space-y-8">
                    {song.lyrics.map((lyric, index) => (
                      <p
                        ref={(el) => (lineRefs.current[index] = el)}
                        key={index}
                        className={`text-2xl leading-8 transition-all ${index === currentLineIndex ? 'font-semibold text-[#fff]' : 'text-slate-400'}`}
                      >
                        {lyric.text || '\u00A0'}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-2 rounded-md border-neutral-400 pt-10 text-center">
                    <Music size={64} className="text-secondary-300" />
                    <p className="mt-2 px-4 text-xl font-semibold text-white">
                      No lyrics available at the moment.
                    </p>
                    <p className="text-lg">Check back soon!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ title, onClick, isActive }) {
  return (
    <button
      className={`grow cursor-pointer border-b px-2 py-4 transition-colors md:py-8 md:text-lg ${isActive ? 'border-secondary-200' : 'border-transparent'}`}
      onClick={() => onClick(title)}
    >
      {title}
    </button>
  );
}

function PlayButton({ icon, onClick, classNames }) {
  const styledIcon = cloneElement(icon, { size: '100%' });
  return (
    <button className={classNames} onClick={onClick}>
      {styledIcon}
    </button>
  );
}

function CurrentTimeNumber() {
  const [currentTime, setCurrentTime] = useState('0:00');

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(formatTime(music.currentTime));
    };

    music.addEventListener('timeupdate', updateCurrentTime);

    return () => {
      music.removeEventListener('timeupdate', updateCurrentTime);
    };
  }, []);

  return <span className="text-primary-100 text-sm">{currentTime}</span>;
}

function SmallAlbumCard(album) {
  const { cover, title, release_date } = album;
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(setSelectedCollection(album));
    dispatch(openMobilePanel('album'));
    dispatch(setQueries({ type: 'album', id: album.id }));
    dispatch(closePlayerPanel());
  };

  return (
    <div className="flex w-[150px] flex-col rounded-xl p-3" onClick={onClick}>
      <img
        src={cover || musicCover}
        alt={title}
        className="mb-2 h-[120px] w-full cursor-pointer rounded-lg object-cover"
      />
      <h3 className="cursor-pointer truncate text-sm font-semibold">{title}</h3>
      <div className="mt-1 flex items-center gap-1 truncate text-xs text-gray-400">
        <span>Album</span>
        <span className="bg-secondary-100 size-0.75 rounded-full"></span>
        <span>{release_date.split('-')[0]}</span>
      </div>
    </div>
  );
}

function SmallAlbumCardSkeleton() {
  return (
    <div className="flex w-[150px] flex-col rounded-xl p-3">
      <div className="relative mb-2 h-[120px] w-full overflow-hidden rounded-lg bg-gray-600/60">
        <ShimmerOverlay />
      </div>
      <div className="relative h-2 w-3/4 overflow-hidden rounded-full bg-gray-600/60">
        <ShimmerOverlay />
      </div>
      <div className="relative mt-1.5 h-1.5 w-2/3 overflow-hidden rounded-full bg-gray-600/60">
        <ShimmerOverlay />
      </div>
    </div>
  );
}

SmallAlbumCard.propTypes = {
  cover: PropTypes.string,
  title: PropTypes.string,
  release_date: PropTypes.string,
};
PlayButton.propTypes = {
  icon: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired,
  classNames: PropTypes.string,
};

MobilePlayerPanel.propTypes = {
  songs: PropTypes.array,
  isPending: PropTypes.bool,
};

TabButton.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default MobilePlayerPanel;
