import { cloneElement, useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeSlash } from 'iconsax-react';

export default function TextField({ type = 'text', value, onChange, placeholder, icon }) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const styledIcon = icon ? cloneElement(icon, { size: 16 }) : null;
  const isFocusedOrHasValue = isFocused || value;
  const isPassword = type === 'password';

  const togglePasswordVisibility = (e) => {
    e.preventDefault(); // prevent the input from losing focus after clicking on the button
    setIsPasswordVisible((prevValue) => !prevValue);
  };

  return (
    <div
      className={`flex w-full items-center rounded-md border transition-all duration-200 lg:rounded-lg ${isFocused ? 'border-primary-50 bg-transparent' : 'bg-primary-50/60 border-transparent'}`}
    >
      <div className={`relative grow ${isPassword ? 'pe-8' : ''} `}>
        <input
          type={isPasswordVisible ? 'text' : type}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          onChange={(e) => onChange(e)}
          className={`relative z-[1] w-full px-2 !bg-transparent text-base outline-none lg:px-3 ${isFocused ? 'text-primary-50' : 'text-primary-800'} ${isPassword ? 'py-2.5 font-[Inter_UI,serif] text-lg tracking-wider' : 'py-3'}`}
        />
        <span
          className={`text-primary-800/50 absolute left-0 flex -translate-y-1/2 items-center gap-1 text-sm transition-all duration-200 ${isFocusedOrHasValue ? '-top-[38%]' : 'top-1/2 px-2'} `}
        >
          <span
            className={`absolute transition-all duration-200 ${isFocusedOrHasValue ? 'invisible opacity-0' : 'visible opacity-100'}`}
          >
            {styledIcon}
          </span>
          <span
            className={`pb-1 transition-all duration-200 ${isFocusedOrHasValue ? 'text-primary-50' : styledIcon ? 'translate-x-5' : ''}`}
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
}

TextField.propTypes = {
  type: PropTypes.oneOf(['text', 'password', 'email']),
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  icon: PropTypes.element,
  onChange: PropTypes.func.isRequired,
};
