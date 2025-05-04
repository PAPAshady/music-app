import { useEffect, useState, useCallback, useRef } from 'react';
import Header from '../../components/shared/Header/Header';
import HamburgerMenu from '../../components/shared/HamburgerMenu/HamburgerMenu';
import Player from '../../components/shared/Player/Player';
import MusicPlayerCard from '../../components/MusicCards/MusicPlayerCard/MusicPlayerCard';
import MusicPlayerCardSkeleton from '../../components/MusicCards/MusicPlayerCard/MusicPlayerCardSkeleton';
import useMediaQuery from '../../hooks/useMediaQuery';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import { lyrics } from '../../data';
import backgroundImage from '../../assets/images/backgrounds/player-and-settings-page.png';
import noMusicCover from '../../assets/images/covers/no-cover.jpg';
import useMusicPlayer from '../../hooks/useMusicPlayer';
import { BASE_URL } from '../../services/api';
import MobilePlaylist from '../../components/shared/MobilePlaylist/MobilePlaylist';
import 'swiper/css';
import './PlayerPage.css';

export default function PlayerPage() {
  const swiperRef = useRef(null);
  const [musicCover, setMusicCover] = useState(noMusicCover);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const {
    playlist,
    currentMusic,
    durations,
    setCurrentSongIndex,
    currentSongIndex,
    prevSongIndex,
  } = useMusicPlayer();

  useEffect(() => {
    const img = new Image();
    img.src = currentMusic?.musiccover ? `${BASE_URL}${currentMusic?.musiccover}` : noMusicCover;
    img.addEventListener('load', () => {
      setMusicCover(img.src);
    });
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
    (musicId) => {
      setCurrentSongIndex(musicId - 1);
    },
    [setCurrentSongIndex]
  );

  return (
    <div
      className="pb- relative min-h-[100dvh] overflow-y-auto bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="relative w-full pt-4">
        <div className="container">
          <Header />
        </div>
      </div>

      <main className="text-secondary-50 relative container h-[calc(100dvh-58px)] pt-6 lg:h-[calc(100dvh-170px)]">
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
                {playlist.musics?.length
                  ? playlist.musics?.map((music) => (
                      <SwiperSlide key={music.id}>
                        <MusicPlayerCard
                          isPlaying={music.id === currentMusic?.id}
                          time={durations.formatedDuration}
                          onClick={playerCardClickHandler}
                          {...music}
                        />
                      </SwiperSlide>
                    ))
                  : Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <SwiperSlide key={index}>
                          <MusicPlayerCardSkeleton />
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
                mask: 'radial-gradient(circle, transparent 18%, black 18%)',
                WebkitMask: 'radial-gradient(circle, transparent 18%, black 18%)',
              }}
            >
              <div className="border-primary-300 size-[27%] rounded-full border-2"></div>
            </div>
          </div>
          <div
            id="lyrics-wrapper"
            className="xs:text-base flex max-h-[200px] flex-col gap-3 overflow-y-auto px-3 text-center text-sm min-[480px]:max-h-[270px] min-[480px]:w-full min-[480px]:text-lg lg:px-4 lg:text-start lg:text-base"
          >
            {lyrics.map((lyric) => (
              <p
                className={`transition-colors duration-300 ${lyric.isShown ? 'text-white-50' : 'text-white-700'}`}
                key={lyric.id}
              >
                {lyric.lyric}
              </p>
            ))}
          </div>
        </div>
        <Player classNames="lg:!bottom-4 lg:!w-full" isPlayerPage />
      </main>
      <HamburgerMenu />
      {isDesktop && <MobilePlaylist />}
    </div>
  );
}
