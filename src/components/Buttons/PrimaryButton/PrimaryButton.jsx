import PropTypes from 'prop-types';

export default function PrimaryButton({ size, title, type = 'fill', clickHandler, disabled }) {
  const buttonSizes = {
    sm: 'px-4 py-2.5 text-xs lg:py-2 lg:text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-8 py-1 text-base',
    xl: 'px-7 py-2 text-base',
  };

  const buttonTypes = {
    fill: 'bg-primary-700 text-white-50 inset-shadow-secondary-400 disabled:text-white-500 disabled:bg-white-700 border-transparent hover:inset-shadow-[1px_1px_10px] hover:shadow-[1px_1px_5px_rgba(0,0,0,.5)]',
    outline:
      'text-white-50 border-primary hover:text-primary-50 disabled:border-white-700 disabled:text-white-500',
    text: 'text-primary-50 hover:text-white-50 disabled:text-white-500 border-transparent',
  };

  return (
    <button
      className={`rounded-lg border py-2 transition-all duration-300 disabled:cursor-default disabled:inset-shadow-none disabled:shadow-none ${buttonSizes[size]} ${buttonTypes[type]}`}
      disabled={disabled}
      onClick={clickHandler}
    >
      {title}
    </button>
  );
}

PrimaryButton.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']).isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['fill', 'outline', 'text']),
  disabled: PropTypes.bool,
  clickHandler: PropTypes.func,
};
