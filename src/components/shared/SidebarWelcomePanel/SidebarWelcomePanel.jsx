import { Music } from 'iconsax-react';
import SearchInput from '../../Inputs/SearchInput/SearchInput';
import useInput from '../../../hooks/useInput';
import MainButton from '../../Buttons/MainButton/MainButton';

export default function SidebarWelcomePanel() {
  const searchInput = useInput();

  return (
    <div className="sticky top-10 hidden xl:block">
      <div className="bg-secondary-400/40 border-secondary-200 container flex h-[calc(100dvh-100px) max-h-[700px] min-h-[430px] w-[270px] flex-col items-center justify-center gap-6 rounded-xl border px-3 py-6 text-center xl:w-[310px]">
        <p className="text-whit text-[1.7rem] font-semibold text-white">No playlist selected</p>
        <div className="grid place-content-center rounded-md border border-dashed p-6">
          <i className="size-18">
            <Music size="100%" />
          </i>
        </div>
        <p className="text-whit text-[1.7rem] font-semibold text-white">Start Listening</p>
        <p>Browse featured playlists, search for music, or create your own playlist.</p>
        <SearchInput {...searchInput} />
        <MainButton title="Create playlist" size="xl"  classNames="!w-full" />
        <div className="flex items-center justify-between gap-2 w-full">
          <MainButton title="Featured" size="sm" type='outline' variant='neutral' classNames='!px-3'  /> 
          <MainButton title="Featured" size="sm" type='outline' variant='neutral' classNames='!px-3'  /> 
          <MainButton title="Featured" size="sm" type='outline' variant='neutral' classNames='!px-3'  /> 
        </div>
      </div>
    </div>
  );
}
