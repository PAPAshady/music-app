import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function SectionTitle({ title, href = '#' }) {
  return (
    <div className="mb-4 flex items-center justify-between lg:mb-6">
      <p className="text-secondary-50 text-base font-medium lg:text-2xl lg:font-semibold">
        {title}
      </p>
      <Link className="text-primary-200 text-xs font-bold lg:text-base lg:font-normal" to={href}>
        See All
      </Link>
    </div>
  );
}

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string,
};
