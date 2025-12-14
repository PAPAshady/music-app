import { useId, forwardRef } from 'react';
import { Sms } from 'iconsax-reactjs';
import PropTypes from 'prop-types';

const EmailInput = forwardRef(({ classNames, isInvalid, errorMsg, disabled, ...props }, ref) => {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <label
        className={`flex items-center gap-2 ${errorMsg ? 'text-red' : 'text-primary-100'}`}
        htmlFor={id}
      >
        {errorMsg || `Email`}
        {disabled && <span className="text-sm">(This field cannot be changed.)</span>}
      </label>
      <div
        className={`focus-within:bg-primary-800/60 flex items-center gap-2 rounded-lg border px-3.5 transition-all duration-300 focus-within:inset-shadow-[4px_4px_10px_1px] focus-within:inset-shadow-[#A7BBE9]/29 ${isInvalid ? 'border-red' : 'border-primary-50'} ${disabled ? 'bg-white-700' : 'bg-primary-900'} ${classNames}`}
      >
        <span className="size-6 lg:size-7">
          <Sms size="100%" />
        </span>
        <input
          {...props}
          className="text-primary-50 grow py-3 text-sm outline-none lg:text-base"
          type="email"
          placeholder="Email"
          ref={ref}
          id={id}
          disabled={disabled}
        />
      </div>
    </div>
  );
});

EmailInput.displayName = 'EmailInput';

EmailInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  classNames: PropTypes.string,
  isInvalid: PropTypes.bool,
  errorMsg: PropTypes.string,
  disabled: PropTypes.bool,
};

export default EmailInput;
