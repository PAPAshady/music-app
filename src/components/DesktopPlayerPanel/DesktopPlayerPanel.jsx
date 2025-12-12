import Player from '../shared/Player/Player';
import MusicPlayerCard from '../MusicCards/MusicPlayerCard/MusicPlayerCard';
import MusicPlayerCardSkeleton from '../MusicCards/MusicPlayerCard/MusicPlayerCardSkeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import { setCurrentSongIndex } from '../../redux/slices/musicPlayerSlice';
import { setAutoLyricsTracker } from '../../redux/slices/musicPlayerSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useCallback, useRef } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import useLyrics from '../../hooks/useLyrics';
import noMusicCover from '../../assets/images/covers/no-cover.jpg';
import { closePanel as closePlayerPanel } from '../../redux/slices/playerPanelSlice';
import { ArrowDown2 } from 'iconsax-reactjs';
import PropTypes from 'prop-types';
import getRandomNoLyricsMessage from '../../utils/getRandomNoLyricsMessage';

function DesktopPlayerPanel({ isPending, songs, isPlayerPanelOpen }) {
  const dispatch = useDispatch();
  const swiperRef = useRef(null);
  const [musicCover, setMusicCover] = useState(noMusicCover);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const currentSongIndex = useSelector((state) => state.musicPlayer.currentSongIndex);
  const prevSongIndex = useSelector((state) => state.musicPlayer.prevSongIndex);
  const lineRefs = useRef([]);
  const containerRef = useRef(null);
  const { currentLineIndex } = useLyrics(lineRefs, containerRef);
  const shouldAutoTrackLyrics = useSelector((state) => state.musicPlayer.autoLyricsTracker);
  const currentMusic = useSelector((state) => state.musicPlayer.currentMusic);
  const { title, description } = getRandomNoLyricsMessage();

  useEffect(() => {
    if (swiperRef.current) {
      const isCurrentSlideVisible =
        swiperRef.current.slides[currentSongIndex]?.classList.contains('swiper-slide-visible');
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
  useEffect(() => {
    const img = new Image();
    img.src = currentMusic?.cover || noMusicCover;
    img.addEventListener('load', () => setMusicCover(img.src));
  }, [currentMusic]);

  // play the song when user clicks on it
  const playerCardClickHandler = useCallback(
    (index) => {
      dispatch(setCurrentSongIndex(index));
    },
    [dispatch]
  );

  const CD_Sizes =
    'size-[220px] xs:size-[260px] min-[480px]:size-[350px] sm:size-[380px] md:size-[450px] lg:size-[300px] min-[1150px]:!size-[370px]';

  return (
    <div className="text-secondary-50 relative container h-[calc(100dvh-58px)] pt-6 lg:h-[calc(100dvh-170px)]">
      <button
        onClick={() => dispatch(closePlayerPanel())}
        className="text-secondary-200 hover:text-secondary-50 hidden items-center gap-2 p-1 text-lg transition-colors lg:flex"
      >
        <span className="flex size-10 cursor-pointer">
          <ArrowDown2 size="100%" />
        </span>
        <span>Back</span>
      </button>

      <div className="flex min-h-full grow flex-col items-center justify-center gap-10 pb-24 min-[480px]:pb-28 sm:gap-12 sm:pb-32 lg:flex-row lg:justify-between lg:pb-8 xl:gap-16 2xl:gap-24!">
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
              className="max-h-95"
            >
              {isPending
                ? Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <SwiperSlide key={index}>
                        <MusicPlayerCardSkeleton />
                      </SwiperSlide>
                    ))
                : songs.map((music, musicIndex) => (
                    <SwiperSlide key={music.id} className="h-auto!">
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
          {currentMusic?.lyrics ? (
            <>
              <div
                className={`xs:text-base lyrics-wrapper flex max-h-57.5 flex-col gap-3 overflow-y-auto px-3 text-center text-sm min-[480px]:max-h-68.75 min-[480px]:text-lg lg:px-4 lg:text-start lg:text-base ${shouldAutoTrackLyrics && 'hide-scrollbar'}`}
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
            </>
          ) : (
            <div className="space-y-6 text-center">
              <p className="text-2xl font-bold">{title}</p>
              <p className="text-secondary-200 text-lg">{description}</p>
            </div>
          )}
        </div>
      </div>
      {isPlayerPanelOpen && <Player classNames="lg:!bottom-4 lg:!w-full" isPlayerPage />}
    </div>
  );
}

DesktopPlayerPanel.propTypes = {
  isPlayerPanelOpen: PropTypes.bool.isRequired,
  isPending: PropTypes.bool.isRequired,
  songs: PropTypes.array,
};

export default DesktopPlayerPanel;
