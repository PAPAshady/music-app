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
import SearchBoxTracksSlider from './SearchBoxSliders/SearchBoxTracksSlider';
import SearchBoxArtistsSlider from './SearchBoxSliders/SearchBoxArtistsSlider';
import SearchBoxAlbumsSlider from './SearchBoxSliders/SearchBoxAlbumsSlider';
import { MusicPlaylist } from 'iconsax-react';
import SearchBoxPlaylistsSlider from './SearchBoxSliders/SearchBoxPlaylistsSlider';

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
        className={`relative transition-all ease-in-out ${isDesktopSearchBoxOpen ? 'z-[30] w-[80%] min-[1200px]:w-[75%] min-[1400px]:w-[65%]' : 'w-[315px]'}`}
      >
        <SearchInput {...searchInput} onFocus={() => setIsDesktopSearchBoxOpen(true)} />
        <div
          className={`text-secondary-50 absolute z-[-1] -mt-4 w-full rounded-md bg-gradient-to-b from-slate-800 to-slate-700 px-2 py-8 ${isDesktopSearchBoxOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}
        >
          <div className="flex items-center gap-2 pb-2">
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
                {(isPending || !!data.songs.length) && (
                  <div>
                    <SliderTitle icon={<Musicnote />} title="Tracks" />
                    <SearchBoxTracksSlider songs={data?.songs} isPending={isPending} />
                  </div>
                )}
                {(isPending || !!data.artists.length) && (
                  <div>
                    <SliderTitle icon={<Profile2User />} title="Artists" />
                    <SearchBoxArtistsSlider artists={data?.artists} isPending={isPending} />
                  </div>
                )}
                {(isPending || !!data.albums.length) && (
                  <div>
                    <SliderTitle icon={<MusicPlaylist />} title="Albums" />
                    <SearchBoxAlbumsSlider albums={data?.albums} isPending={isPending} />
                  </div>
                )}
                {(isPending || !!data.playlists.length) && (
                  <div>
                    <SliderTitle icon={<MusicPlaylist />} title="Playlists" />
                    <SearchBoxPlaylistsSlider playlists={data?.playlists} isPending={isPending} />
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
        className={`fixed inset-0 size-full transition-all ${isDesktopSearchBoxOpen ? 'z-20 bg-black/50' : 'z-[-1]'}`}
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
    <div className="mb-3 flex items-center gap-2">
      {icon}
      <p className="text-lg font-semibold">{title}</p>
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

export default DesktopSearchBox;
