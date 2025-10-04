import { createPortal } from 'react-dom';
import SearchInput from '../Inputs/SearchInput/SearchInput';
import useInput from '../../hooks/useInput';
import { useQuery } from '@tanstack/react-query';
import SongCardSkeleton from '../MusicCards/SongCard/SongCardSkeleton';
import SongCard from '../MusicCards/SongCard/SongCard';
import { Music } from 'iconsax-react';
import AlbumCard from '../MusicCards/AlbumCard/AlbumCard';
import AlbumCardSkeleton from '../MusicCards/AlbumCard/AlbumCardSkeleton';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { globalSearchQueryOptions } from '../../queries/globalSearch';
import useDebounce from '../../hooks/useDebounce';
import { useSelector } from 'react-redux';

export default function MobileSearchPanel() {
  const [activeFilter, setActiveFilter] = useState('all');
  const searchInput = useInput();
  const query = useDebounce(searchInput.value, 500);
  const { data, isPending } = useQuery(globalSearchQueryOptions(query.trim(), activeFilter));
  const isOpen = useSelector((state) => state.mobileSearchPanel.isOpen);

  const filterButtons = [
    { id: 1, text: 'all' },
    { id: 2, text: 'songs' },
    { id: 3, text: 'artists' },
    { id: 4, text: 'albums' },
    { id: 5, text: 'playlists' },
  ];

  return createPortal(
    <div
      className={`text-secondary-50 fixed inset-0 z-10 bg-gradient-to-b from-slate-800 to-slate-700 transition ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
    >
      <div className="container flex h-full flex-col py-2">
        <div className="flex grow flex-col gap-4 overflow-y-auto">
          <div>
            <SearchInput {...searchInput} />
            <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
              {filterButtons.map((button) => (
                <FilterButton
                  key={button.id}
                  {...button}
                  isActive={button.text === activeFilter}
                  onClick={setActiveFilter}
                />
              ))}
            </div>
          </div>
          {searchInput.value.trim() ? (
            <>
              {(isPending || !!data.songs.length) && (
                <div>
                  <p className="mb-2 text-2xl font-bold">Songs</p>
                  <div className="grid grid-cols-1 gap-3 px-1 min-[992px]:!grid-cols-3 sm:grid-cols-2">
                    {isPending
                      ? Array(4)
                          .fill()
                          .map((_, index) => <SongCardSkeleton key={index} />)
                      : data?.songs.map((song, index) => (
                          <SongCard key={song.id} song={song} index={index} />
                        ))}
                  </div>
                </div>
              )}
              {(isPending || !!data.albums.length) && (
                <div>
                  <p className="mb-2 text-2xl font-bold">Albums</p>
                  <div className="grid grid-cols-1 gap-3 px-1">
                    {isPending
                      ? Array(4)
                          .fill()
                          .map((_, index) => <AlbumCardSkeleton key={index} size="md" />)
                      : data?.albums.map((album) => (
                          <AlbumCard size="md" key={album.id} album={album} />
                        ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="mt-4 flex grow flex-col items-center justify-center gap-3 rounded-md px-8 text-center">
              <Music size={72} />
              <p className="text-2xl font-semibold">Let the music begin</p>
              <p className="text-">You can now start searching for your tunes!</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.getElementById('mobileSearchPanel')
  );
}

function FilterButton({ text, isActive, onClick }) {
  return (
    <button
      className={`text-secondary-100 cursor-pointer rounded-full border border-transparent bg-slate-600 px-2 py-1.5 text-sm capitalize transition-colors hover:border-slate-500 ${isActive && 'outline-1'}`}
      onClick={() => onClick(text)}
    >
      {text}
    </button>
  );
}

FilterButton.propTypes = {
  text: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};
