import { cloneElement, useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeSlash } from 'iconsax-react';

const TextField = forwardRef(({ type = 'text', value, placeholder, icon, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const styledIcon = icon ? cloneElement(icon, { size: '100%' }) : null;
  const isFocusedOrHasValue = isFocused || value;
  const isPassword = type === 'password';

  const togglePasswordVisibility = (e) => {
    e.preventDefault(); // prevent the input from losing focus after clicking on the button
    setIsPasswordVisible((prevValue) => !prevValue);
  };

  const onBlur = (e) => {
    props.onBlur?.(e);
    setIsFocused(false);
  };

  return (
    <div
      className={`flex w-full items-center rounded-md border transition-all duration-200 lg:rounded-lg ${isFocused ? 'border-primary-50 bg-transparent' : 'bg-primary-50/60 border-transparent'}`}
    >
      <div className={`relative grow ${isPassword ? 'pe-8' : ''} `}>
        <input
          {...props}
          value={value}
          type={isPasswordVisible ? 'text' : type}
          onFocus={() => setIsFocused(true)}
          onBlur={onBlur}
          ref={ref}
          className={`relative z-[1] w-full !bg-transparent px-2 text-base outline-none lg:px-3 ${isFocused ? 'text-primary-50' : 'text-primary-800'} ${isPassword ? 'py-2.5 font-[Inter_UI,serif] text-lg tracking-wider' : 'py-3'}`}
        />
        <span
          className={`text-primary-800/50 absolute left-0 flex -translate-y-1/2 items-center gap-1 text-sm transition-all duration-200 ${isFocusedOrHasValue ? '-top-[38%]' : 'top-1/2 px-2'} `}
        >
          <span
            className={`1 absolute size-5 transition-all duration-200 lg:size-6 ${isFocusedOrHasValue ? 'invisible opacity-0' : 'visible opacity-100'}`}
          >
            {styledIcon}
          </span>
          <span
            className={`transition-all duration-200 ${isFocusedOrHasValue ? 'text-primary-50' : styledIcon ? 'translate-x-6 lg:translate-x-8' : ''}`}
          >
            {placeholder}
          </span>
        </span>
        {isPassword && (
          <button
            onMouseDown={togglePasswordVisibility} // using onMouseDown instead of onClick prevents the input from blurring after click.
            className={`absolute top-1/2 right-0 z-[2] -translate-y-1/2 pe-3 ${isFocused ? 'inline' : 'hidden'}`}
          >
            {isPasswordVisible ? (
              <EyeSlash size={16} className="text-primary-50" />
            ) : (
              <Eye size={16} className="text-primary-50" />
            )}
          </button>
        )}
      </div>
    </div>
  );
});

TextField.propTypes = {
  type: PropTypes.oneOf(['text', 'password', 'email', 'number']),
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  icon: PropTypes.element,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
};

TextField.displayName = 'TextField';

export default TextField;
