import PropTypes from 'prop-types';

export default function LoginButton({ title, size, classNames, onClick, disabled }) {
  const buttonSizes = {
    sm: 'lg:py-1.5 lg:px-4',
    md: 'lg:py-[11px] lg:px-6 lg:rounded-2xl',
    lg: 'lg:py-4 lg:px-12 lg:font-semibold lg:text-2xl lg:rounded-3xl',
  };

  return (
    <button
      disabled={disabled}
      onClick={(e) => onClick(e)}
      className={`bg-primary-50 border-primary-50 text-primary hover:border-primary-100 hover:text-primary-50 rounded-lg border px-8 py-[14px] text-base font-medium transition-colors duration-300 hover:bg-[#9CAFE6]/50 ${buttonSizes[size]} ${classNames}`}
    >
      {title}
    </button>
  );
}

LoginButton.propTypes = {
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']).isRequired,
  classNames: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};
