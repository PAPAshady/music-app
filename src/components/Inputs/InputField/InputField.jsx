import { forwardRef } from 'react';
import { useId } from 'react';
import PropTypes from 'prop-types';

const InputField = forwardRef(
  ({ placeholder = 'Text', classNames, isInvalid, errorMsg, ...props }, ref) => {
    const id = useId();
    return (
      <div className="flex w-full flex-col gap-2">
        <label
          className={`text-sm transition-colors duration-300 lg:text-base ${errorMsg ? 'text-red' : 'text-primary-100'}`}
          htmlFor={id}
        >
          {errorMsg ?? placeholder}
        </label>
        <input
          {...props}
          className={`text-primary-50 bg-primary-900 focus:bg-primary-800/60 w-full grow rounded-lg border px-3.5 py-2.5 text-sm transition-all duration-300 outline-none focus:inset-shadow-[4px_4px_10px_1px] focus:inset-shadow-[#A7BBE9]/29 lg:text-base ${classNames} ${isInvalid ? 'border-red' : 'border-primary-50'}`}
          type="text"
          placeholder={placeholder}
          id={id}
          ref={ref}
        />
      </div>
    );
  }
);

InputField.displayName = 'InputField';

InputField.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  classNames: PropTypes.string,
  isInvalid: PropTypes.bool,
  errorMsg: PropTypes.string,
};

export default InputField;
