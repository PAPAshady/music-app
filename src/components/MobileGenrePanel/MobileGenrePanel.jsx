import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import defaultCover from '../../assets/images/covers/no-cover.jpg';
import { useSelector, useDispatch } from 'react-redux';
import { getGenreByIdQueryOptions } from '../../queries/genres';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'iconsax-reactjs';
import { closeMobileGenrePanel } from '../../redux/slices/mobileGenrePanelSlice';
import { setQueries } from '../../redux/slices/queryStateSlice';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import MobileGenerePanelAlbumsList from './MobileGenerePanelAlbumsList';
import MobileGenrePanelPlaylistsList from './MobileGenrePanelPlaylistsList';

function MobileGenrePanel() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.mobileGenrePanel.isOpen);
  const id = useSelector((state) => state.queryState.id);
  const type = useSelector((state) => state.queryState.type);
  const {
    data: genre,
    isPending: isGenrePending,
    failureReason,
    isError,
  } = useQuery({ ...getGenreByIdQueryOptions(id), enabled: !!id && type === 'genre' });
  const showErrorPanel =
    failureReason?.code === '22P02' || failureReason?.code === 'PGRST116' || isError;

  const closePanel = () => {
    dispatch(setQueries({ type: null, id: null }));
    dispatch(closeMobileGenrePanel());
  };

  useEffect(() => {
    if (type !== 'genre') dispatch(closeMobileGenrePanel());
  }, [type, dispatch]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [isOpen]);

  if (showErrorPanel) {
    return <Navigate to="/404" />;
  }

  return createPortal(
    <div
      className={`text-secondary-50 fixed inset-0 z-10 overflow-y-auto bg-linear-to-b from-slate-700 to-slate-900 transition-all ${isOpen ? 'top-0 opacity-100' : 'top-full opacity-0'}`}
    >
      <div className={`fixed top-0 z-1 px-4 pt-3 ${!isOpen ? 'hidden' : ''}`}>
        <button
          className="grid size-12 place-content-center rounded-full bg-black/50"
          onClick={closePanel}
        >
          <span className="block size-8">
            <ArrowLeft size="100%" />
          </span>
        </button>
      </div>

      <div className="relative space-y-6 overflow-hidden">
        {isGenrePending ? (
          <div className="grid size-full h-screen place-content-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div
              className="relative h-[40dvh] overflow-hidden bg-cover bg-center"
              style={{ backgroundImage: `url(${genre?.cover || defaultCover})` }}
            >
              <div className="absolute top-0 flex size-full flex-col justify-end gap-2 bg-linear-to-t from-black/80 to-transparent p-5 sm:gap-4 lg:p-10">
                <p className="text-5xl font-black lg:text-6xl">{genre?.title}</p>
                <p className="text-secondary-100 text-sm sm:text-base lg:text-lg">
                  {genre?.description}
                </p>
                <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
                  {genre?.tags?.map((tag) => (
                    <Tag key={tag} tag={tag} />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-10 px-3 pb-10">
              <MobileGenrePanelPlaylistsList genreId={genre?.id} />
              <MobileGenerePanelAlbumsList genreId={genre?.id} />
            </div>
          </>
        )}
      </div>
    </div>,
    document.getElementById('mobileGenrePanel')
  );
}

function Tag({ tag }) {
  return (
    <span className="rounded-full bg-slate-700 px-3 py-1 text-sm font-semibold capitalize">
      {tag}
    </span>
  );
}

Tag.propTypes = {
  tag: PropTypes.string.isRequired,
};

export default MobileGenrePanel;
