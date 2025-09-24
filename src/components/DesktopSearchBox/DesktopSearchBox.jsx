import PropTypes from 'prop-types';
import { Music } from 'iconsax-react';
import { useState } from 'react';
import SearchInput from '../Inputs/SearchInput/SearchInput';
import useCloseOnClickOutside from '../../hooks/useCloseOnClickOutside ';
import useDebounce from '../../hooks/useDebounce';
import useInput from '../../hooks/useInput';
import { useQuery } from '@tanstack/react-query';
import { globalSearchQueryOptions } from '../../queries/globalSearch';
import { Musicnote, Profile2User } from 'iconsax-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { artists } from '../../data';
import SongCard from '../MusicCards/SongCard/SongCard';
import SongCardSkeleton from '../MusicCards/SongCard/SongCardSkeleton';
import { chunkArray } from '../../utils/arrayUtils';
import ShimmerOverlay from '../ShimmerOverlay/ShimmerOverlay';
import { isPending } from '@reduxjs/toolkit';

function DesktopSearchBox() {
  const [activeButton, setActiveButton] = useState('all');
  const searchInput = useInput();
  const query = useDebounce(searchInput.value, 500);
  const { data, isPending } = useQuery(globalSearchQueryOptions(query.trim(), activeButton));
  const {
    isVisible: isDesktopSearchBoxOpen,
    setIsVisible: setIsDesktopSearchBoxOpen,
    ref: desktopSearchBoxRef,
  } = useCloseOnClickOutside();

  const filterButtons = [
    { id: 1, text: 'all' },
    { id: 2, text: 'songs' },
    { id: 3, text: 'artists' },
    { id: 4, text: 'albums' },
    { id: 5, text: 'playlists' },
  ];

  return (
    <div className="relative w-full">
      <div
        ref={desktopSearchBoxRef}
        className={`relative z-30 transition-all ease-in-out ${isDesktopSearchBoxOpen ? 'w-[65%]' : 'w-[315px]'}`}
      >
        <SearchInput {...searchInput} onFocus={() => setIsDesktopSearchBoxOpen(true)} />
        <div
          className={`text-secondary-50 absolute z-[-1] -mt-4 w-full rounded-md bg-gradient-to-b from-slate-800 to-slate-700 px-2 py-8 ${isDesktopSearchBoxOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}
        >
          <div className="flex items-center gap-2">
            {filterButtons.map((button) => (
              <FilterButton
                key={button.id}
                isActive={button.text === activeButton}
                onClick={() => setActiveButton(button.text)}
                {...button}
              />
            ))}
          </div>
          <div className="max-h-[450px] overflow-y-auto px-4">
            {searchInput.value.trim() ? (
              <div className="flex flex-col gap-4 py-6">
                {(activeButton === 'all' || activeButton === 'songs') && (
                  <div>
                    <SliderTitle icon={<Musicnote />} title="Tracks" />
                    <TracksSlider songs={data?.songs} isPending={isPending} />
                  </div>
                )}
                {(activeButton === 'all' || activeButton === 'artists') && (
                  <div>
                    <SliderTitle icon={<Profile2User />} title="Artists" />
                    <ArtistsSlider artists={data?.artists} isPending={isPending} />
                  </div>
                )}
              </div>
            ) : (
              <div className="dir-ltr mt-4 flex h-[300px] flex-col items-center justify-center gap-3 rounded-md border border-dashed px-8 text-center">
                <Music size={72} />
                <p className="text-2xl font-semibold">Let the music begin</p>
                <p className="text-">You can now start searching for your tunes!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={`fixed inset-0 size-full transition-all ${isDesktopSearchBoxOpen && 'z-20 bg-black/50'}`}
      ></div>
    </div>
  );
}

function FilterButton({ text, isActive, onClick }) {
  return (
    <button
      className={`text-secondary-100 cursor-pointer rounded-full border border-transparent bg-slate-600 px-3 py-1.5 text-sm capitalize transition-colors hover:border-slate-500 ${isActive && 'outline-1'}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

function SliderTitle({ icon, title }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      {icon}
      <p className="text-lg font-semibold">{title}</p>
    </div>
  );
}

function TracksSlider({ songs, isPending }) {
  return (
    <Swiper
      slidesPerView={2.4}
      spaceBetween={16}
      modules={[Pagination]}
      pagination={{ clickable: true }}
      freeMode
    >
      {chunkArray(isPending ? Array(8).fill() : songs, 2).map((songsArr, index) => (
        <SwiperSlide key={index} className="pb-11">
          <div className="flex flex-col gap-3">
            {songsArr.map((song, index) =>
              isPending ? (
                <SongCardSkeleton key={index} />
              ) : (
                <SongCard key={song.id} song={song} index={index} size="sm" />
              )
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function ArtistsSlider({ artists, isPending }) {
  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={28}
      modules={[Pagination]}
      pagination={{ clickable: true }}
    >
      {isPending
        ? Array(10)
            .fill()
            .map((_, index) => (
              <SwiperSlide key={index} className="!w-auto pb-11">
                <ArtistSekeleton />
              </SwiperSlide>
            ))
        : artists.map((artist) => (
            <SwiperSlide key={artist.id} className="!w-auto p-[1px] pb-11">
              <Artist {...artist} />
            </SwiperSlide>
          ))}
    </Swiper>
  );
}

function Artist(artist) {
  const { image, name } = artist;

  return (
    <div className="group flex max-w-auto cursor-pointer flex-col items-center text-center">
      <img
        src={image}
        className="group-hover:outline-primary-50 mb-1 size-24 rounded-full object-cover outline-1 outline-transparent transition-colors"
      />
      <span>{name}</span>
    </div>
  );
}

function ArtistSekeleton() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-2 size-24 overflow-hidden rounded-full bg-gray-600/60">
        <ShimmerOverlay />
      </div>
      <span className="relative h-2 w-[70%] overflow-hidden rounded-full bg-gray-600/60">
        <ShimmerOverlay />
      </span>
    </div>
  );
}

FilterButton.propTypes = {
  text: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};

SliderTitle.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
};

TracksSlider.propTypes = {
  songs: PropTypes.array,
  isPending: PropTypes.bool,
};

ArtistsSlider.propTypes = {
  artists: PropTypes.array,
  isPending: PropTypes.bool,
};

export default DesktopSearchBox;
