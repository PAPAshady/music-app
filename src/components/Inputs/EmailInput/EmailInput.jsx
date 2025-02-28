import { useId } from 'react';
import { Sms } from 'iconsax-react';
import PropTypes from 'prop-types';

export default function EmailInput({ value, onChange, classNames }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <label className="text-primary-100 text-sm" htmlFor={id}>
        Email
      </label>
      <div
        className={`border-primary-50 bg-primary-900 focus-within:bg-primary-800/60 flex items-center gap-2 rounded-lg border px-3.5 transition-all duration-300 focus-within:inset-shadow-[4px_4px_10px_1px] focus-within:inset-shadow-[#A7BBE9]/29 ${classNames}`}
      >
        <span className="size-6 lg:size-7">
          <Sms size="100%" />
        </span>
        <input
          className="text-primary-50 grow py-2 text-sm outline-none lg:py-2.5 lg:text-base"
          type="email"
          placeholder="Email"
          id={id}
          value={value}
          onChange={(e) => onChange(e)}
        />
      </div>
    </div>
  );
}

EmailInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  classNames: PropTypes.string,
};
