import PropTypes from 'prop-types';

export default function MainButton({
  size,
  title,
  type = 'fill',
  variant = 'primary',
  onClick,
  disabled,
  classNames,
}) {
  const buttonSizes = {
    sm: 'px-4 py-2.5 text-xs lg:py-2 lg:text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-8 py-1 text-base',
    xl: 'px-7 py-2 text-base',
  };

  const fillVariants = {
    primary: 'text-white-50 bg-primary-700 disabled:bg-white-700 disabled:text-white-500',
    secondary:
      'text-white-50 bg-secondary-500 disabled:bg-white-700 disabled:text-white-50 disabled:font-semibold',
    neutral: 'bg-white-100 text-primary-500 disabled:text-white-500 disabled:bg-white-700',
  };

  const outlineVariants = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    neutral: 'border-white',
  };

  const neutralVariants = {
    primary: 'text-primary-50',
    secondary: 'text-secondary-50',
    neutral: 'text-white-100',
  };

  const buttonTypes = {
    fill: `inset-shadow-secondary-400 border-transparent hover:inset-shadow-[1px_1px_10px] hover:shadow-[1px_1px_5px_rgba(0,0,0,.5)] ${fillVariants[variant]}`,
    outline: `text-white-50 hover:text-primary-50 disabled:border-white-700 disabled:text-white-500 ${outlineVariants[variant]}`,
    text: `hover:text-white-50 disabled:text-white-500 border-transparent ${neutralVariants[variant]}`,
  };

  return (
    <button
      className={`rounded-lg border py-2 transition-all duration-300 disabled:cursor-default disabled:inset-shadow-none disabled:shadow-none ${buttonSizes[size]} ${buttonTypes[type]} ${classNames}`}
      disabled={disabled}
      onClick={onClick}
    >
      {title}
    </button>
  );
}

MainButton.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['fill', 'outline', 'text']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'neutral']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  classNames: PropTypes.string,
};
