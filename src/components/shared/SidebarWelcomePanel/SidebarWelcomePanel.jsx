import MainButton from '../../Buttons/MainButton/MainButton';
import Logo from '../../Logo/Logo';
import { useDispatch } from 'react-redux';
import { openModal } from '../../../redux/slices/playlistInfosModalSlice';
import { AnimatePresence, motion } from 'framer-motion';

const MotionDiv = motion.div;

export default function SidebarWelcomePanel() {
  const dispatch = useDispatch();

  return (
    <div className="sticky top-10 hidden xl:block">
      <AnimatePresence mode="wait">
        <MotionDiv
          className="border-secondary-200 container flex h-[calc(100dvh-120px)] max-h-132.5 min-h-115 w-67.5 flex-col items-center justify-center gap-6 overflow-y-auto rounded-xl border bg-linear-to-b from-slate-700 to-slate-900 px-3 py-6 text-center xl:w-77.5"
          variants={{
            initial: { opacity: 0, y: 15 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 15 },
            transition: { duration: 0.2 },
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          <p className="text-whit text-[1.7rem] font-semibold text-white">Nothing is playing</p>
          <Logo size="lg" />
          <p>
            Browse featured playlists and albums, search for music, or create your own playlist.
          </p>
          <div className="flex w-full flex-col items-center justify-between gap-3">
            <MainButton
              title="Create playlist"
              size="md"
              variant="secondary"
              classNames="w-full"
              onClick={() =>
                dispatch(
                  openModal({ title: 'Create new playlist.', actionType: 'create_playlist' })
                )
              }
            />
          </div>
        </MotionDiv>
      </AnimatePresence>
    </div>
  );
}
