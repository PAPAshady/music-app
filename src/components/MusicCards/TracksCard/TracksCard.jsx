import PropTypes from 'prop-types';
import defaultCover from '../../../assets/images/covers/no-cover.jpg';

export default function TracksCard({ title, cover }) {
  return (
    <div
      className="hover:outline-primary-50 xs:h-[13dvw] relative h-[28dvw] w-full cursor-pointer overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat outline outline-transparent transition-colors duration-300 lg:h-[8dvw] lg:max-h-[100px]"
      style={{ backgroundImage: `url(${cover || defaultCover})` }}
    >
      <div className="xs:px-1 flex size-full items-end justify-center bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-transparent px-3 py-2 lg:justify-start lg:p-2">
        <p className="text-white-50 xs:text-xs text-xl sm:text-lg md:text-xl">{title}</p>
      </div>
    </div>
  );
}

TracksCard.propTypes = {
  title: PropTypes.string.isRequired,
  cover: PropTypes.string,
};
