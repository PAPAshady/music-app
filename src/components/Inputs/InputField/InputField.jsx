import { useId } from 'react';
import PropTypes from 'prop-types';

export default function InputField({ value, onChange, placeholder = 'Text', classNames }) {
  const id = useId();
  return (
    <div className="flex w-full flex-col gap-2">
      <label className="text-primary-100 text-sm lg:text-base" htmlFor={id}>
        {placeholder}
      </label>
      <input
        className={`text-primary-50 border-primary-50 bg-primary-900 focus:bg-primary-800/60 w-full grow rounded-lg border px-3.5 py-2.5 text-sm transition-all duration-300 outline-none focus:inset-shadow-[4px_4px_10px_1px] focus:inset-shadow-[#A7BBE9]/29 lg:text-base ${classNames}`}
        type="text"
        placeholder={placeholder}
        id={id}
        value={value}
        onChange={(e) => onChange(e)}
      />
    </div>
  );
}

InputField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  classNames: PropTypes.string,
};
