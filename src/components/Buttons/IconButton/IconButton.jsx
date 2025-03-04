import { cloneElement } from 'react';
import PropTypes from 'prop-types';

export default function IconButton({ icon, disabled, onClick, isActive, showBadge, classNames }) {
  const styledIcon = cloneElement(icon, { className: `${icon.props.className} size-full` });
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center rounded-md border border-transparent p-1 transition-colors duration-300 sm:size-8 ${disabled ? 'border-white-800 bg-white-800/40 text-white-700' : 'hover:bg-primary-700 text-secondary-100 hover:text-secondary-50'} ${isActive ? 'bg-primary-700 text-secondary-50' : ''} ${classNames}`}
      disabled={disabled}
    >
      {styledIcon}

      {/* show a small blue circle if there is something that needs user attention */}
      {showBadge && !disabled && (
        <span className="bg-primary-400 absolute top-0 right-0 size-2 rounded-full text-[10px]"></span>
      )}
    </button>
  );
}

IconButton.propTypes = {
  icon: PropTypes.element.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
  showBadge: PropTypes.bool,
  classNames: PropTypes.string,
};
