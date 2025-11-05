import MainButton from '../../Buttons/MainButton/MainButton';
import Logo from '../../Logo/Logo';
import { useDispatch } from 'react-redux';
import { openModal } from '../../../redux/slices/playlistInfosModalSlice';

export default function SidebarWelcomePanel() {
  const dispatch = useDispatch();

  return (
    <div className="sticky top-10 hidden xl:block">
      <div className="border-secondary-200 container flex h-[calc(100dvh-120px)] max-h-[530px] min-h-[460px] w-[270px] flex-col items-center justify-center gap-6 overflow-y-auto rounded-xl border bg-gradient-to-b from-slate-700 to-slate-900 px-3 py-6 text-center xl:w-[310px]">
        <p className="text-whit text-[1.7rem] font-semibold text-white">Nothing is playing</p>
        <Logo size="lg" />
        <p>Browse featured playlists and albums, search for music, or create your own playlist.</p>
        <div className="flex w-full flex-col items-center justify-between gap-3">
          <MainButton
            title="Create playlist"
            size="md"
            variant="secondary"
            classNames="w-full"
            onClick={() =>
              dispatch(openModal({ title: 'Create new playlist.', actionType: 'create_playlist' }))
            }
          />
        </div>
      </div>
    </div>
  );
}
