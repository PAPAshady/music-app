import PropTypes from 'prop-types';
import defaultCover from '../../../assets/images/covers/no-cover.jpg';

import { Link, useLocation } from 'react-router-dom';

export default function GenreCard({ id, title, cover, classNames }) {
  const pathname = useLocation().pathname;

  return (
    <Link
      className={`hover:outline-primary-50 xs:h-[13dvw] relative h-[28dvw] w-full cursor-pointer overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat outline outline-transparent transition-colors duration-300 lg:h-[8dvw] lg:max-h-[100px] ${classNames}`}
      style={{ backgroundImage: `url(${cover || defaultCover})` }}
      to={`${pathname}?type=genre&id=${id}`}
    >
      <div className="xs:px-1 flex size-full items-end justify-center bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-transparent px-3 py-2 lg:justify-start lg:p-2">
        <p className="text-white-50 text-xl sm:text-lg md:text-xl">{title}</p>
      </div>
    </Link>
  );
}

GenreCard.propTypes = {
  title: PropTypes.string.isRequired,
  cover: PropTypes.string,
  id: PropTypes.string.isRequired,
  classNames: PropTypes.string,
};
