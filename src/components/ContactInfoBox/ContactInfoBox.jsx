import { cloneElement } from 'react';
import PropTypes from 'prop-types';

export default function ContactInfoBox({ icon, title, description, contactInfo, classNames }) {
  const styledIcon = cloneElement(icon, { size: '100%' });
  return (
    <div
      className={`hover:bg-secondary-400 flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-colors duration-300 lg:gap-3 ${classNames}`}
    >
      <div className="text-primary-500 bg-primary-50 grid size-12 place-content-center rounded-full lg:size-14">
        <span className="size-6 lg:size-7">{styledIcon}</span>
      </div>
      <p className="text-primary-50 font-semibold lg:text-lg">{title}</p>
      <p className="text-primary-100 hidden lg:block">{description}</p>
      <p className="text-primary-100 mt-2 text-sm lg:text-base lg:font-semibold">{contactInfo}</p>
    </div>
  );
}

ContactInfoBox.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  contactInfo: PropTypes.string.isRequired,
  classNames: PropTypes.string,
};
