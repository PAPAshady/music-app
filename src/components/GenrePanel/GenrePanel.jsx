import { useQuery } from '@tanstack/react-query';
import { getGenreByIdQueryOptions } from '../../queries/genres';
import { getPlaylistsByGenreQueryOptions } from '../../queries/playlists';
import { useSelector } from 'react-redux';
import defaultCover from '../../assets/images/covers/no-cover.jpg';
import ShimmerOverlay from '../ShimmerOverlay/ShimmerOverlay';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

function GenrePanel() {
  const genreId = useSelector((state) => state.queryState.id);
  const { data: genre, isPending: isGenrePending } = useQuery(getGenreByIdQueryOptions(genreId));
  const { data: playlists, isPending: isPlaylistsPending } = useQuery(
    getPlaylistsByGenreQueryOptions(genreId)
  );
  const hasPlaylists = isPlaylistsPending || playlists?.length > 0;

  return (
    <div className="sticky top-10 hidden xl:block">
      <div className="border-secondary-200 flex h-[calc(100dvh-100px)] max-h-[700px] min-h-[430px] w-[270px] flex-col rounded-xl border bg-gradient-to-b from-slate-700 to-slate-900 px-3 py-5 xl:w-[310px] 2xl:h-[calc(100dvh-200px)]">
        <div className="h-full overflow-y-auto scroll-smooth pe-4">
          <div className="h-full space-y-3">
            {isGenrePending ? (
              <>
                <div className="relative mt-3 mb-5 h-4 w-1/2 overflow-hidden rounded-full bg-gray-600/60">
                  <ShimmerOverlay />
                </div>
                <div className="relative h-[30%] overflow-hidden rounded-lg bg-gray-600/60">
                  <ShimmerOverlay />
                </div>
                <div className="mt-5 space-y-3">
                  <DescriptionLineSkeleton width="100%" />
                  <DescriptionLineSkeleton width="50%" />
                </div>
                <div className="mt-5 flex items-center justify-start gap-2 px-0.5">
                  <TagSkeleton />
                  <TagSkeleton />
                  <TagSkeleton />
                </div>
              </>
            ) : (
              <>
                <p className="mb-4 text-3xl font-bold">{genre?.title}</p>
                <div className="h-[30%] overflow-hidden rounded-lg">
                  <img
                    src={genre?.cover || defaultCover}
                    alt={genre?.title}
                    className="size-full object-cover"
                  />
                </div>
                <p className="text-[13px]">{genre?.description}</p>
                <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-1.5">
                  {genre?.tags.map((tag) => (
                    <Tag key={tag} tag={tag} />
                  ))}
                </div>
              </>
            )}

            <div className="mt-6 space-y-2">
              <p className="font-bold">Top Curated Playlists</p>
              {hasPlaylists ? (
                <Swiper
                  modules={[Pagination]}
                  spaceBetween={4}
                  pagination={{ clickable: true }}
                  slidesPerView={2.2}
                >
                  {isPlaylistsPending
                    ? Array(6)
                        .fill()
                        .map((_, index) => (
                          <SwiperSlide key={index} className="pb-9">
                            <SmallTracklistCardSkeleton />
                          </SwiperSlide>
                        ))
                    : playlists?.map((playlist) => (
                        <SwiperSlide key={playlist.id} className="pb-9">
                          <SmallTracklistCard {...playlist} />
                        </SwiperSlide>
                      ))}
                </Swiper>
              ) : (
                <p className="text-secondary-200 text-sm">No playlists found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tag({ tag }) {
  return (
    <p className="text-secondary-100 rounded-full bg-slate-900 px-3 py-1 text-[11px] capitalize">
      {tag}
    </p>
  );
}

function TagSkeleton() {
  return (
    <div className="relative h-3 w-12 overflow-hidden rounded-full bg-gray-600/60">
      <ShimmerOverlay />
    </div>
  );
}

function DescriptionLineSkeleton({ width }) {
  return (
    <div className="relative h-2 overflow-hidden rounded-full bg-gray-600/60" style={{ width }}>
      <ShimmerOverlay />
    </div>
  );
}

function SmallTracklistCard({ title, cover, tracklistType, release_date, totaltracks }) {
  return (
    <div className="flex w-[110px] flex-col rounded-xl">
      <img
        src={cover || defaultCover}
        alt={title}
        className="mb-2 h-[100px] w-full cursor-pointer rounded-lg object-cover"
      />
      <h3 className="cursor-pointer truncate text-sm font-semibold">{title}</h3>
      <div className="mt-1 flex items-center gap-1 truncate text-xs text-gray-400">
        <span className="capitalize">{tracklistType}</span>
        <span className="bg-secondary-100 size-0.75 rounded-full"></span>
        <span>
          {tracklistType === 'album'
            ? release_date.split('-')[0]
            : `${totaltracks ? (totaltracks > 1 ? `${totaltracks} tracks` : '1 track') : 'No tracks'}`}
        </span>
      </div>
    </div>
  );
}

function SmallTracklistCardSkeleton() {
  return (
    <div className="flex w-[110px] flex-col rounded-xl">
      <div className="relative mb-2 h-[100px] w-full overflow-hidden rounded-lg bg-gray-600/60">
        <ShimmerOverlay />
      </div>
      <div className="relative h-2 w-3/4 overflow-hidden rounded-full bg-gray-600/60">
        <ShimmerOverlay />
      </div>
      <div className="relative mt-1.5 h-1.5 w-2/3 overflow-hidden rounded-full bg-gray-600/60">
        <ShimmerOverlay />
      </div>
    </div>
  );
}

Tag.propTypes = {
  tag: PropTypes.string.isRequired,
};

DescriptionLineSkeleton.propTypes = { width: PropTypes.string };

SmallTracklistCard.propTypes = {
  title: PropTypes.string.isRequired,
  cover: PropTypes.string,
  tracklistType: PropTypes.string.isRequired,
  release_date: PropTypes.string,
  totaltracks: PropTypes.number,
};

export default GenrePanel;
