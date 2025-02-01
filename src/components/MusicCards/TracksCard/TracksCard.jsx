import PropTypes from 'prop-types';

export default function TracksCard({ title, image }) {
  return (
    <div
      className="hover:outline-primary-50 relative h-12 w-[120px] cursor-pointer overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat outline outline-transparent transition-colors duration-300 lg:h-[88px] lg:w-64"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="flex size-full items-end justify-center bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-transparent p-1 lg:justify-start lg:px-3 lg:py-2">
        <p className="text-white-50 text-xs lg:text-2xl">{title}</p>
      </div>
    </div>
  );
}

TracksCard.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};
