import { cloneElement } from 'react';
import PropTypes from 'prop-types';

export default function IconButton({ icon, disabled, clickHandler, isActive }) {
  const styledIcon = cloneElement(icon, { className: `${icon.props.className} size-full` });
  return (
    <button
      onClick={clickHandler}
      className={`flex items-center justify-center rounded-md border border-transparent p-1 transition-colors duration-300 sm:size-8 ${disabled ? 'border-white-800 bg-white-800/40 text-white-700' : 'hover:bg-primary-700 text-secondary-100 hover:text-secondary-50'} ${isActive ? 'bg-primary-700 text-secondary-50' : ''}`}
      disabled={disabled}
    >
      {styledIcon}
    </button>
  );
}

IconButton.propTypes = {
  icon: PropTypes.element.isRequired,
  disabled: PropTypes.bool,
  clickHandler: PropTypes.func,
  isActive: PropTypes.bool,
};
