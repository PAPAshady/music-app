import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { SearchNormal1, ArrowDown2 } from 'iconsax-reactjs';
import { getAllPrivatePlaylistsQueryOptions } from '../../queries/playlists';
import { useQuery } from '@tanstack/react-query';
import useInput from '../../hooks/useInput';
import AddSongToPlaylistMobilePanelPlaylistsList from './AddSongToPlaylistMobilePanelPlaylistsList';
import { useSelector, useDispatch } from 'react-redux';
import { closeMobilePanel } from '../../redux/slices/addSongToPlaylistSlice';
import { openModal as openPlaylistInfosModal } from '../../redux/slices/playlistInfosModalSlice';

function AddSongToPlaylistMobilePanel() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.addSongToPlaylist.isMobilePanelOpen);
  const searchInput = useInput();
  const { data, isPending } = useQuery(getAllPrivatePlaylistsQueryOptions());
  const playlists = data?.filter((playlist) =>
    playlist.title.toLowerCase().includes(searchInput.value.toLowerCase())
  );
  const noPlaylistsExists = !data.length;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
    return () => (document.body.style.overflow = 'visible');
  }, [isOpen]);

  return createPortal(
    <div
      className={`fixed inset-0 flex items-end bg-black/40 backdrop-blur transition-all duration-300 will-change-transform ${isOpen ? 'z-20 translate-y-0 opacity-100' : 'z-[-1] translate-y-full opacity-0'} `}
    >
      <div className="text-secondary-50 flex h-[90%] grow flex-col rounded-t-2xl bg-linear-to-b from-slate-700 to-slate-900">
        <div className="flex justify-center pt-4 pb-3">
          <button
            className="rounded-md bg-slate-600 px-4"
            onClick={() => dispatch(closeMobilePanel())}
          >
            <ArrowDown2 size={32} />
          </button>
        </div>
        <div className="mb-4 flex items-center justify-between px-3 md:px-6">
          <span className="text-xl font-bold text-white">Save in</span>
          <button
            className="text-secondary-200 text-base font-bold"
            onClick={() =>
              dispatch(
                openPlaylistInfosModal({
                  title: 'Create new playlist',
                  actionType: 'create_playlist',
                })
              )
            }
          >
            New playlist
          </button>
        </div>
        <div className="px-2 md:px-6">
          <div className="flex items-center overflow-hidden rounded-sm bg-slate-800">
            <div className="xs:ps-3 ps-1.5">
              <div className="xs:size-6 size-4">
                <SearchNormal1 size="100%" />
              </div>
            </div>
            <input
              type="text"
              placeholder="Find playlist"
              className="xs:p-3 grow p-1.5 ps-2 font-semibold outline-none"
              value={searchInput.value}
              onChange={searchInput.onChange}
            />
          </div>
        </div>
        <AddSongToPlaylistMobilePanelPlaylistsList
          playlists={playlists}
          isPending={isPending}
          noPlaylistsExists={noPlaylistsExists}
        />
      </div>
    </div>,
    document.getElementById('addSongToPlaylistMobilePanel')
  );
}

export default AddSongToPlaylistMobilePanel;
