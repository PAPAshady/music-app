import { createPortal } from 'react-dom';
import SearchInput from '../Inputs/SearchInput/SearchInput';
import useInput from '../../hooks/useInput';
import { useQuery } from '@tanstack/react-query';
import { Music, ArrowLeft } from 'iconsax-reactjs';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { useSelector, useDispatch } from 'react-redux';
import { closeMobileSearchPanel } from '../../redux/slices/mobileSearchPanelSlice';
import { getSongsByKeywordQueryOptions } from '../../queries/musics';
import { getAlbumsByKeywordQueryOptions } from '../../queries/albums';
import { getArtistsByKeywordQueryOptions } from '../../queries/artists';
import { getPlaylistsByKeywordQueryOptions } from '../../queries/playlists';
import MobileSearchPanelSongsList from './MobileSearchPanelSongsList';
import MobileSearchPanelAlbumsList from './MobileSearchPanelAlbumsList';
import MobileSearchPanelArtistsList from './MobileSearchPanelArtistsList';
import MobileSearchPanelPlaylistsList from './MobileSearchPanelPlaylistsList';

export default function MobileSearchPanel() {
  const dispatch = useDispatch();
  const searchInput = useInput();
  const query = useDebounce(searchInput.value, 500);
  const isOpen = useSelector((state) => state.mobileSearchPanel.isOpen);
  const inputRef = useRef(null);
  const {
    data: playlists,
    isPending: isPlaylistsPending,
    isLoading: isPlaylistsLoading,
  } = useQuery(getPlaylistsByKeywordQueryOptions(query));
  const {
    data: songs,
    isPending: isSongsPending,
    isLoading: isSongsLoading,
  } = useQuery(getSongsByKeywordQueryOptions(query, { limit: 4 }));
  const {
    data: albums,
    isPending: isAlbumsPending,
    isLoading: isAlbumsLoading,
  } = useQuery(getAlbumsByKeywordQueryOptions(query, { limit: 4 }));
  const {
    data: artists,
    isPending: isArtistsPending,
    isLoading: isArtistsLoading,
  } = useQuery(getArtistsByKeywordQueryOptions(query, { limit: 6 }));
  const isLoading = isPlaylistsLoading && isSongsLoading && isAlbumsLoading && isArtistsLoading;
  const hasData = [playlists, albums, songs, artists].some((data) => data?.length);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      inputRef.current.focus();
    } else document.body.style.overflow = 'visible';

    return () => (document.body.style.overflow = 'visible');
  }, [isOpen]);

  return createPortal(
    <div
      className={`text-secondary-50 fixed inset-0 z-10 bg-gradient-to-b from-slate-800 to-slate-700 transition ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
    >
      <div className="container flex h-full flex-col py-2">
        <div className="flex grow flex-col gap-4 overflow-y-auto pb-6">
          <div>
            <div className="flex items-center justify-between gap-3">
              <button onClick={() => dispatch(closeMobileSearchPanel())}>
                <ArrowLeft />
              </button>
              <div className="grow">
                <SearchInput {...searchInput} ref={inputRef} />
              </div>
            </div>
          </div>
          {searchInput.value.trim() ? (
            !isLoading && !hasData ? (
              <div className="mt-4 flex grow flex-col items-center justify-center gap-3 rounded-md px-8 text-center">
                <Music size={72} />
                <p className="max-w-[500px] text-2xl font-semibold">
                  Couldn&apos;t find anyting. Try searching for something else.
                </p>
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-10">
                {(isSongsPending || !!songs?.length) && (
                  <MobileSearchPanelSongsList songs={songs} isSongsPending={isSongsPending} />
                )}
                {(isAlbumsPending || !!albums?.length) && (
                  <MobileSearchPanelAlbumsList albums={albums} isAlbumsPending={isAlbumsPending} />
                )}
                {(isArtistsPending || !!artists?.length) && (
                  <MobileSearchPanelArtistsList
                    artists={artists}
                    isArtistsPending={isArtistsPending}
                  />
                )}
                {(isPlaylistsPending || !!playlists?.length) && (
                  <MobileSearchPanelPlaylistsList
                    playlists={playlists}
                    isPlaylistsPending={isPlaylistsPending}
                  />
                )}
              </div>
            )
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
