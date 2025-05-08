import MainButton from '../../Buttons/MainButton/MainButton';
import Logo from '../../Logo/Logo';
import usePlaylistInfosModal from '../../../hooks/usePlaylistInfosModal';

export default function SidebarWelcomePanel() {
  const { openPlaylistModal } = usePlaylistInfosModal();

  return (
    <div className="sticky top-10 hidden xl:block">
      <div className="bg-secondary-400/40 border-secondary-200 container flex h-[calc(100dvh-130px)] max-h-[520px] w-[270px] flex-col items-center justify-center gap-6 overflow-y-auto rounded-xl border px-3 py-6 text-center xl:w-[310px]">
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
            onClick={() => openPlaylistModal('Create new playlist.')}
          />
          <MainButton
            title="Search"
            size="md"
            type="outline"
            variant="neutral"
            classNames="w-full"
          />
        </div>
      </div>
    </div>
  );
}
