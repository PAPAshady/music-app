import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import defaultCover from '../../assets/images/covers/no-cover.jpg';
import { useSelector, useDispatch } from 'react-redux';
import { getGenreByIdQueryOptions } from '../../queries/genres';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'iconsax-react';
import { closeMobileGenrePanel } from '../../redux/slices/mobileGenrePanelSlice';
import { setQueries } from '../../redux/slices/queryStateSlice';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { getPlaylistsByGenreQueryOptions } from '../../queries/playlists';
import PlaylistCard from '../MusicCards/PlaylistCard/PlaylistCard';
import PlaylistCardSkeleton from '../MusicCards/PlaylistCard/PlaylistCardSkeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import PropTypes from 'prop-types';
import { getAlbumsByGenreIdQueryOptions } from '../../queries/albums';
import AlbumCard from '../MusicCards/AlbumCard/AlbumCard';
import AlbumCardSkeleton from '../MusicCards/AlbumCard/AlbumCardSkeleton';
import { chunkArray, shuffleArray } from '../../utils/arrayUtils';
import { Navigate } from 'react-router-dom';

function MobileGenrePanel() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.mobileGenrePanel.isOpen);
  const id = useSelector((state) => state.queryState.id);
  const {
    data: genre,
    isPending: isGenrePending,
    failureReason,
    isError,
  } = useQuery(getGenreByIdQueryOptions(id));
  const { data: playlists, isPending: isPlaylistsPending } = useQuery(
    getPlaylistsByGenreQueryOptions(genre?.id)
  );
  const { data: albums, isPending: isAlbumPending } = useQuery(
    getAlbumsByGenreIdQueryOptions(genre?.id)
  );
  const hasPlaylists = isPlaylistsPending || playlists?.length > 0;
  const hasAlbums = isAlbumPending || albums?.length > 0;
  const showErrorPanel =
    failureReason?.code === '22P02' || failureReason?.code === 'PGRST116' || isError;

  const closePanel = () => {
    dispatch(setQueries({ type: null, id: null }));
    dispatch(closeMobileGenrePanel());
  };

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
      className={`text-secondary-50 fixed inset-0 z-10 overflow-y-auto bg-gradient-to-b from-slate-700 to-slate-900 transition-all ${isOpen ? 'top-0 opacity-100' : 'top-full opacity-0'}`}
    >
      <div className="fixed top-0 z-[1] px-4 pt-3">
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
              <div className="absolute top-0 flex size-full flex-col justify-end gap-2 sm:gap-4 bg-gradient-to-t from-black/80 to-transparent p-5 lg:p-10">
                <p className="text-5xl font-black lg:text-6xl">{genre?.title}</p>
                <p className="text-secondary-100 text-sm sm:text-base lg:text-lg">{genre?.description}</p>
                <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
                  {genre?.tags?.map((tag) => (
                    <Tag key={tag} tag={tag} />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-10 px-3 pb-10">
              <div className="space-y-6">
                <p className="text-2xl font-bold">Top Curated Playlists</p>
                {hasPlaylists ? (
                  <Swiper
                    spaceBetween={16}
                    slidesPerView={1.5}
                    modules={[Pagination]}
                    pagination={{ clickable: true, enabled: false }}
                    breakpoints={{
                      390: { slidesPerView: 2.2 },
                      520: { slidesPerView: 3, pagination: { enabled: true } },
                      768: { slidesPerView: 4, pagination: { enabled: true } },
                      1024: { slidesPerView: 5.3, pagination: { enabled: true } },
                      1120: { slidesPerView: 6.3, pagination: { enabled: true }, spaceBetween: 20 },
                    }}
                  >
                    {isPlaylistsPending
                      ? Array(9)
                          .fill()
                          .map((_, index) => (
                            <SwiperSlide key={index} className="min-[520px]:pb-10">
                              <PlaylistCardSkeleton />
                            </SwiperSlide>
                          ))
                      : playlists?.map((playlist) => (
                          <SwiperSlide key={playlist.id} className="p-[1px] min-[520px]:pb-10">
                            <PlaylistCard {...playlist} />
                          </SwiperSlide>
                        ))}
                  </Swiper>
                ) : (
                  <p>No playlists found</p>
                )}
              </div>
              <div className="space-y-6">
                <p className="text-2xl font-bold">Related Albums</p>
                {hasAlbums ? (
                  <Swiper
                    spaceBetween={16}
                    modules={[Pagination]}
                    slidesPerView={albums?.length > 3 ? 1.2 : 1}
                    pagination={{ clickable: true, enabled: false }}
                    breakpoints={{
                      640: { slidesPerView: 2, pagination: { enabled: true } },
                      1200: { slidesPerView: 3, pagination: { enabled: true } },
                    }}
                  >
                    {isAlbumPending
                      ? chunkArray(shuffleArray(Array(12).fill()), 3).map((albumsArr, index) => (
                          <SwiperSlide key={index} className="sm:pb-11">
                            <div className="space-y-3">
                              {albumsArr.map((_, index) => (
                                <AlbumCardSkeleton key={index} />
                              ))}
                            </div>
                          </SwiperSlide>
                        ))
                      : chunkArray(albums || [], 3).map((albumsArr, index) => (
                          <SwiperSlide key={index} className="sm:pb-11">
                            <div className="space-y-3">
                              {albumsArr.map((album) => (
                                <AlbumCard
                                  key={album.id}
                                  album={album}
                                  size="md"
                                  classNames="!max-w-full"
                                />
                              ))}
                            </div>
                          </SwiperSlide>
                        ))}
                  </Swiper>
                ) : (
                  <p>No albums found</p>
                )}
              </div>
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
