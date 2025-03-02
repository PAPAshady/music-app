import { useId, useState } from 'react';
import PropTypes from 'prop-types';

export default function TextArea({ value, placeholder, onChange, maxLength, classNames }) {
  const [isFocused, setIsFocused] = useState(false);
  const id = useId();
  return (
    <div className="flex flex-col items-start gap-1.5">
      <label className="text-primary-100" htmlFor={id}>
        {placeholder}
      </label>
      <textarea
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        maxLength={maxLength}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`border-primary-50 focus:bg-primary-800/60 bg-primary-900 text-primary-50 min-h-[120px] w-full min-w-[280px] rounded-lg border px-3.5 py-2.5 font-medium transition-all duration-300 outline-none focus:inset-shadow-[4px_4px_10px_1px] focus:shadow-[4px_4px_8px_1px] focus:shadow-[black]/40 focus:inset-shadow-[#A7BBE9]/29 min-[480px]:h-[140px] md:w-full ${classNames}`}
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

TextArea.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  maxLength: PropTypes.number,
  classNames: PropTypes.string,
};
