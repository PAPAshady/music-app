import MainButton from '../../Buttons/MainButton/MainButton';
import Logo from '../../Logo/Logo';
import PlaylistInfosModalContext from '../../../contexts/PlaylistInfosModalContext';
import useSafeContext from '../../../hooks/useSafeContext';
import { useNavigate } from 'react-router-dom';

export default function SidebarWelcomePanel() {
  const { openPlaylistModal } = useSafeContext(PlaylistInfosModalContext);
  const navigate = useNavigate();

  const onConfirm = (data) => {
    console.log(data);
  };

  return (
    <div className="sticky top-10 hidden xl:block">
      <div className="bg-secondary-400/40 border-secondary-200 container flex h-[calc(100dvh-120px)] max-h-[530px] min-h-[460px] w-[270px] flex-col items-center justify-center gap-6 overflow-y-auto rounded-xl border px-3 py-6 text-center xl:w-[310px]">
        <p className="text-whit text-[1.7rem] font-semibold text-white">No playlist selected</p>
        <Logo size="lg" />
        <p>Browse featured playlists, search for music, or create your own playlist.</p>
        <div className="flex w-full flex-col items-center justify-between gap-3">
          <MainButton
            title="Create playlist"
            size="md"
            type="outline"
            variant="neutral"
            classNames="w-full"
            onClick={() => openPlaylistModal('Create new playlist.', onConfirm)}
          />
          <MainButton
            title="Browse"
            size="md"
            type="outline"
            variant="neutral"
            classNames="w-full"
            onClick={() => navigate('/browse')}
          />
        </div>
      </div>
    </div>
  );
}
