import { useEffect, useState, useCallback, useRef } from 'react';
import Player from '../Player/Player';
import MusicPlayerCard from '../../MusicCards/MusicPlayerCard/MusicPlayerCard';
import MusicPlayerCardSkeleton from '../../MusicCards/MusicPlayerCard/MusicPlayerCardSkeleton';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import backgroundImage from '../../../assets/images/backgrounds/player-and-settings-page.png';
import noMusicCover from '../../../assets/images/covers/no-cover.jpg';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSongIndex } from '../../../redux/slices/musicPlayerSlice';
import { useQuery } from '@tanstack/react-query';
import useLyrics from '../../../hooks/useLyrics';
import { setAutoLyricsTracker } from '../../../redux/slices/musicPlayerSlice';
import { ArrowLeft } from 'iconsax-react';
import {
  getRelatedSongsBySongDataQueryOptions,
  getSongsByAlbumIdQueryOptions,
  getSongsByPlaylistIdQueryOptions,
  getPopularSongsByArtistIdQueryOptions,
  getFavoriteSongsQueryOptions,
} from '../../../queries/musics';
import 'swiper/css';
import './PlayerPanel.css';
import { closePanel as closePlayerPanel } from '../../../redux/slices/playerPanelSlice';

export default function PlayerPanel() {
  const isOpen = useSelector((state) => state.playerPanel.isOpen);
  const swiperRef = useRef(null);
  const lineRefs = useRef([]);
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const [musicCover, setMusicCover] = useState(noMusicCover);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const playingTracklist = useSelector((state) => state.playContext.currentCollection);
  const selectedSingleSong = useSelector((state) => state.playContext.singleSong);
  const currentMusic = useSelector((state) => state.musicPlayer.currentMusic);
  const currentSongIndex = useSelector((state) => state.musicPlayer.currentSongIndex);
  const prevSongIndex = useSelector((state) => state.musicPlayer.prevSongIndex);
  const queuelistType = useSelector((state) => state.playContext.queuelistType);
  const { data: tracklistSongs, isPending: isTracklistSongsPending } = useQuery(
    queuelistType === 'related_songs'
      ? getRelatedSongsBySongDataQueryOptions(selectedSingleSong)
      : queuelistType === 'playlist'
        ? getSongsByPlaylistIdQueryOptions(playingTracklist.id)
        : queuelistType === 'album'
          ? getSongsByAlbumIdQueryOptions(playingTracklist.id)
          : queuelistType === 'artist_popular_songs'
            ? getPopularSongsByArtistIdQueryOptions(currentMusic?.artist_id)
            : getFavoriteSongsQueryOptions()
  );
  const { currentLineIndex } = useLyrics(lineRefs, containerRef);
  const shouldAutoTrackLyrics = useSelector((state) => state.musicPlayer.autoLyricsTracker);

  useEffect(() => {
    const img = new Image();
    img.src = currentMusic?.cover || noMusicCover;
    img.addEventListener('load', () => setMusicCover(img.src));
  }, [currentMusic]);

  useEffect(() => {
    if (swiperRef.current) {
      const isCurrentSlideVisible =
        swiperRef.current.slides[currentSongIndex].classList.contains('swiper-slide-visible');
      // slide to current song if its not visible in slider
      if (!isCurrentSlideVisible) {
        // slide one by one instead of all at once
        if (prevSongIndex < currentSongIndex) {
          swiperRef.current.slideTo(currentSongIndex - 2);
        } else {
          swiperRef.current.slideTo(currentSongIndex);
        }
      }
    }
  }, [currentSongIndex, prevSongIndex]);

  const CD_Sizes =
    'size-[220px] xs:size-[260px] min-[480px]:size-[350px] sm:size-[380px] md:size-[450px] lg:size-[300px] min-[1150px]:!size-[370px]';

  // play the song when user clicks on it
  const playerCardClickHandler = useCallback(
    (index) => {
      dispatch(setCurrentSongIndex(index));
    },
    [dispatch]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
    return () => (document.body.style.overflow = 'hidden');
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 transition-all duration-300 will-change-transform ${isOpen ? 'z-10 translate-y-0 opacity-100' : 'z-[-1] translate-y-full opacity-0'}`}
    >
      <div
        className="relative min-h-[100dvh] overflow-y-auto bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <button
          onClick={() => dispatch(closePlayerPanel())}
          className="text-secondary-50 fixed top-3 left-3 z-[1] sm:top-5 sm:left-5 md:top-7 md:left-7 lg:hidden"
        >
          <span className="block size-8 cursor-pointer md:size-10">
            <ArrowLeft size="100%" />
          </span>
        </button>

        <main className="text-secondary-50 relative container h-[calc(100dvh-58px)] pt-6 lg:h-[calc(100dvh-170px)]">
          <button
            onClick={() => dispatch(closePlayerPanel())}
            className="text-secondary-200 hover:text-secondary-50 hidden items-center gap-2 p-1 text-lg transition-colors lg:flex"
          >
            <span className="flex size-10 cursor-pointer">
              <ArrowLeft size="100%" />
            </span>
            <span>Back</span>
          </button>

          <div className="flex min-h-full grow flex-col items-center justify-center gap-10 pb-24 min-[480px]:pb-28 sm:gap-12 sm:pb-32 lg:flex-row lg:justify-between lg:pb-8 xl:gap-16 2xl:!gap-24">
            {isDesktop && (
              <div className="mx-auto w-full grow">
                <Swiper
                  onSwiper={(swiper) => (swiperRef.current = swiper)}
                  watchSlidesProgress
                  slidesPerView={3}
                  spaceBetween={16}
                  direction="vertical"
                  modules={[Mousewheel]}
                  mousewheel={{ forceToAxis: true }}
                  className="max-h-[380px]"
                >
                  {isTracklistSongsPending
                    ? Array(6)
                        .fill(0)
                        .map((_, index) => (
                          <SwiperSlide key={index}>
                            <MusicPlayerCardSkeleton />
                          </SwiperSlide>
                        ))
                    : tracklistSongs.map((music, musicIndex) => (
                        <SwiperSlide key={music.id} className="!h-auto">
                          <MusicPlayerCard
                            isPlaying={music.id === currentMusic?.id}
                            onClick={playerCardClickHandler}
                            musicIndex={musicIndex}
                            {...music}
                          />
                        </SwiperSlide>
                      ))}
                </Swiper>
              </div>
            )}
            <div>
              <div
                className={`border-primary-300 flex animate-[rotate_20s_linear_infinite] items-center justify-center rounded-full border-2 bg-cover bg-center bg-no-repeat ${CD_Sizes}`}
                style={{
                  backgroundImage: `url(${musicCover})`,
                  mask: 'radial-gradient(circle, transparent 15%, black 15%)',
                  WebkitMask: 'radial-gradient(circle, transparent 15%, black 15%)',
                }}
              >
                <div className="border-primary-300 size-[22.5%] rounded-full border-2"></div>
              </div>
            </div>
            <div className="min-[480px]:w-full">
              <div
                className={`xs:text-base lyrics-wrapper flex max-h-[230px] flex-col gap-3 overflow-y-auto px-3 text-center text-sm min-[480px]:max-h-[275px] min-[480px]:text-lg lg:px-4 lg:text-start lg:text-base ${shouldAutoTrackLyrics && 'hide-scrollbar'}`}
                ref={containerRef}
              >
                {currentMusic?.lyrics?.map((lyric, index) => (
                  <p
                    className={`transition-colors duration-300 ${currentLineIndex === index ? 'text-white-50' : 'text-white-700'}`}
                    key={lyric.time}
                    ref={(el) => (lineRefs.current[index] = el)}
                  >
                    {lyric.text}
                  </p>
                ))}
              </div>
              <label className="hidden px-4 pt-8 lg:block">
                <input
                  type="checkbox"
                  checked={shouldAutoTrackLyrics}
                  onChange={() => dispatch(setAutoLyricsTracker(!shouldAutoTrackLyrics))}
                />
                <span className="ms-2">Auto-Sync</span>
              </label>
            </div>
          </div>
          {isOpen && <Player classNames="lg:!bottom-4 lg:!w-full" isPlayerPage />}
        </main>
      </div>
    </div>
  );
}
