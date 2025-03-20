import { useId, forwardRef } from 'react';
import { Sms } from 'iconsax-react';
import PropTypes from 'prop-types';

const EmailInput = forwardRef(({ classNames, isInvalid, errorMsg, ...props }, ref) => {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <label className={errorMsg ? 'text-red' : 'text-primary-100'} htmlFor={id}>
        {errorMsg || 'Email'}
      </label>
      <div
        className={`bg-primary-900 focus-within:bg-primary-800/60 flex items-center gap-2 rounded-lg border px-3.5 transition-all duration-300 focus-within:inset-shadow-[4px_4px_10px_1px] focus-within:inset-shadow-[#A7BBE9]/29 ${classNames} ${isInvalid ? 'border-red' : 'border-primary-50'}`}
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
};

export default EmailInput;
