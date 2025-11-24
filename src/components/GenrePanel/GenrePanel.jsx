import { useQuery } from '@tanstack/react-query';
import { getGenreByIdQueryOptions } from '../../queries/genres';
import { useSelector } from 'react-redux';
import defaultCover from '../../assets/images/covers/no-cover.jpg';
import ShimmerOverlay from '../ShimmerOverlay/ShimmerOverlay';
import PropTypes from 'prop-types';

function GenrePanel() {
  const genreId = useSelector((state) => state.queryState.id);
  const { data: genre, isPending: isGenrePending } = useQuery(getGenreByIdQueryOptions(genreId));

  return (
    <div className="sticky top-10 hidden xl:block">
      <div className="border-secondary-200 flex h-[calc(100dvh-100px)] max-h-[700px] min-h-[430px] w-[270px] flex-col rounded-xl border bg-gradient-to-b from-slate-700 to-slate-900 px-3 py-5 xl:w-[310px] 2xl:h-[calc(100dvh-200px)]">
        {isGenrePending ? (
          <div className="h-full space-y-3 overflow-y-auto scroll-smooth px-2">
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
            <div className="mt-5 flex items-center justify-start gap-3 px-0.5">
              <TagSkeleton />
              <TagSkeleton />
              <TagSkeleton />
            </div>
          </div>
        ) : (
          <div className="h-full space-y-3 overflow-y-auto scroll-smooth px-2">
            <p className="mb-4 text-3xl font-bold">{genre?.title}</p>
            <div className="h-[30%] overflow-hidden rounded-lg">
              <img
                src={genre?.cover || defaultCover}
                alt={genre?.title}
                className="size-full object-cover"
              />
            </div>
            <p className="text-[13px]">{genre?.description}</p>
            <div className="flex items-center justify-start gap-3">
              {genre?.tags.map((tag) => (
                <Tag key={tag} tag={tag} />
              ))}
            </div>
          </div>
        )}
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

Tag.propTypes = {
  tag: PropTypes.string.isRequired,
};

DescriptionLineSkeleton.propTypes = { width: PropTypes.string };

export default GenrePanel;
