import { useEffect } from 'react';
import useSnackbar from '../../../hooks/useSnackbar';
import { InfoCircle, TickCircle, Danger } from 'iconsax-react';

export default function Snackbar() {
  const { isOpen, setIsOpen, message, messageType, hideDuration } = useSnackbar();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsOpen(false), hideDuration);
    }
  }, [isOpen, hideDuration, setIsOpen]);

  const iconStyles = {
    success: 'text-green',
    error: 'text-red',
    warning: 'text-yellow',
  };

  return (
    <div
      className={`text-primary-50 border-primary-300 xs:w-[340px] fixed top-0 z-50 w-[300px] translate-x-2 rounded-sm border bg-[#4E6C96]/53 px-3 py-1.5 text-xs backdrop-blur-md transition-all ease-in-out min-[480px]:max-w-[420px] min-[480px]:translate-x-3 sm:max-w-[520px] sm:text-sm lg:translate-x-6 ${isOpen ? 'translate-y-4 lg:translate-y-6' : '-translate-y-full'}`}
    >
      <div className="flex items-center justify-between gap-3 py-1.5">
        <p className="truncate">{message ? message : 'Provide a message.'}</p>
        <div className={iconStyles[messageType]}>
          {messageType === 'success' ? (
            <TickCircle />
          ) : messageType === 'warning' ? (
            <InfoCircle />
          ) : (
            <Danger />
          )}
        </div>
      </div>
    </div>
  );
}
