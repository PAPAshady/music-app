import ShimmerOverlay from '../ShimmerOverlay/ShimmerOverlay';
import PropTypes from 'prop-types';

export default function SectionTitle({ title, isPending }) {
  return (
    <div
      className={`mb-4 flex items-center justify-between lg:mb-6 ${isPending ? 'relative h-3 w-1/2 max-w-[270px] overflow-hidden rounded-full bg-gray-600/60 lg:h-3.5 lg:max-w-[350px]' : ''} `}
    >
      {isPending ? (
        <ShimmerOverlay />
      ) : (
        <p className="text-secondary-50 text-lg font-medium lg:text-2xl lg:font-semibold">
          {title}
        </p>
      )}
    </div>
  );
}

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string,
  isPending: PropTypes.bool,
};
