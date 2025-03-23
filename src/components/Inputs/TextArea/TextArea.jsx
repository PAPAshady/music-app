import { useId, useState, forwardRef } from 'react';
import PropTypes from 'prop-types';

const TextArea = forwardRef(
  ({ value, placeholder, maxLength, classNames, isInvalid, errorMsg, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const id = useId();

    const onBlur = (e) => {
      props.onBlur?.(e);
      setIsFocused(false);
    };

    return (
      <div className="flex flex-col items-start gap-1.5 transition-colors duration-300">
        <label className={errorMsg ? 'text-red' : 'text-primary-100'} htmlFor={id}>
          {errorMsg || placeholder}
        </label>
        <textarea
          {...props}
          id={id}
          placeholder={placeholder}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={onBlur}
          ref={ref}
          className={`focus:bg-primary-800/60 bg-primary-900 text-primary-50 min-h-[120px] w-full min-w-[280px] rounded-lg border px-3.5 py-2.5 font-medium transition-all duration-300 outline-none focus:inset-shadow-[4px_4px_10px_1px] focus:shadow-[4px_4px_8px_1px] focus:shadow-[black]/40 focus:inset-shadow-[#A7BBE9]/29 min-[480px]:h-[140px] md:w-full ${classNames} ${isInvalid ? 'border-red' : 'border-primary-50'}`}
        ></textarea>
        {maxLength && (
          <p
            className={`text-primary-100 text-sm transition-opacity ${!isFocused ? 'opacity-0' : ''}`}
          >
            {maxLength - value.length} characters left
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

TextArea.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  maxLength: PropTypes.number,
  classNames: PropTypes.string,
  isInvalid: PropTypes.bool,
  errorMsg: PropTypes.string,
};

export default TextArea;
