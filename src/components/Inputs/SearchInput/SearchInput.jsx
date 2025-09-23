import PropTypes from 'prop-types';
import { SearchNormal1, CloseCircle } from 'iconsax-react';

export default function SearchInput({
  value,
  onChange,
  disabled,
  reset,
  classNames,
  onFocus,
  onBlur,
}) {
  return (
    <div
      className={`focus-within:border-secondary-300 focus-within:inset-shadow-secondary-300 focus-within:bg-secondary-700 flex items-center justify-between gap-2 rounded-lg border px-1.5 py-2 shadow-[2px_2px_7px_rgba(0,0,0,0.6)] transition-all duration-300 lg:px-4 ${disabled ? 'bg-white-800/40 border-white-800' : 'bg-secondary-600/50 inset-shadow-secondary-400 border-transparent inset-shadow-[2px_2px_10px]'} ${classNames}`}
    >
      <button className={disabled ? 'text-white-600' : 'text-secondary-50'}>
        <SearchNormal1 className="size-4 lg:size-5" />
      </button>
      <input
        type="text"
        disabled={disabled}
        className="placeholder:text-secondary-300 text-secondary-50 w-full grow-[1] text-[14px] outline-0 lg:text-base"
        placeholder={disabled ? '' : 'Search'}
        onChange={(e) => onChange(e)}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
      />
      {!disabled && (
        <button onClick={() => reset()}>
          <CloseCircle
            className={`text-secondary-100 size-4 transition-all duration-300 lg:size-5 ${value ? 'visible opacity-100' : 'invisible opacity-0'}`}
          />
        </button>
      )}
    </div>
  );
}

SearchInput.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  classNames: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};
