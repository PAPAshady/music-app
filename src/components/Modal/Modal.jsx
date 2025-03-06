import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';
import MainButton from '../Buttons/MainButton/MainButton';
import { CloseCircle } from 'iconsax-react';
import PropTypes from 'prop-types';

export default function Modal({
  isOpen,
  setIsOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmButton,
  cancelButton,
  confirmButtonTitle = 'Confirm',
}) {
  const closeHandler = () => {
    onClose?.();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={closeHandler} className="relative z-50">
      <DialogBackdrop
        className={`fixed inset-0 bg-black/30 backdrop-blur-xs transition ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className="bg-primary-700/60 flex max-h-[450px] w-full max-w-[500px] flex-col gap-3 rounded-xl p-6 backdrop-blur-sm transition data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <div className="mb-2 flex items-center justify-between">
            <DialogTitle className="text-primary-50 text-xl font-semibold">{title}</DialogTitle>
            <button className="text-white-400 size-6" onClick={closeHandler}>
              <CloseCircle size="100%" />
            </button>
          </div>
          <div className="grow overflow-y-auto">{children}</div>
          <div className="flex items-center justify-end gap-3">
            {cancelButton && (
              <MainButton
                title="Cancel"
                size="sm"
                type="outline"
                variant="secondary"
                onClick={closeHandler}
              />
            )}
            {confirmButton && (
              <MainButton
                title={confirmButtonTitle}
                size="sm"
                variant="secondary"
                onClick={onConfirm}
              />
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  confirmButton: PropTypes.bool,
  cancelButton: PropTypes.bool,
  confirmButtonTitle: PropTypes.string,
};
