import PropTypes from 'prop-types';

export default function SectionTitle({ title }) {
  return (
    <div className="mb-4 flex items-center justify-between lg:mb-6">
      <p className="text-secondary-50 text-lg font-medium lg:text-2xl lg:font-semibold">{title}</p>
    </div>
  );
}

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string,
};
