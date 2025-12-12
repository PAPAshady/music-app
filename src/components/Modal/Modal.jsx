import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';
import MainButton from '../Buttons/MainButton/MainButton';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { CloseCircle } from 'iconsax-reactjs';
import PropTypes from 'prop-types';

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  onCancel,
  confirmButton,
  cancelButton,
  confirmButtonTitle = 'Confirm',
  confirmButtonDisabled,
  confirmButtonClassNames,
  cancelButtonClassNames,
  isSubmitting,
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        className={`fixed inset-0 bg-black/30 backdrop-blur-xs transition ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className="bg-primary-700/60 flex max-h-[550px] w-full max-w-[650px] flex-col gap-3 rounded-xl px-4 py-6 backdrop-blur-sm transition data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <div className="mb-2 flex items-center justify-between">
            <DialogTitle className="text-primary-50 text-xl font-semibold">{title}</DialogTitle>
            <button className="text-white-400 size-6" onClick={onClose}>
              <CloseCircle size="100%" />
            </button>
          </div>
          <div className="grow overflow-y-auto px-3">{children}</div>
          <div className="flex items-center justify-end gap-3">
            {cancelButton && (
              <MainButton
                title="Cancel"
                size="sm"
                type="outline"
                variant="secondary"
                onClick={onCancel}
                classNames={cancelButtonClassNames}
                disabled={isSubmitting}
              />
            )}
            {confirmButton &&
              (isSubmitting ? (
                <div className="border-red bg-red rounded-lg border px-7 py-2">
                  <LoadingSpinner size="xs" />
                </div>
              ) : (
                <MainButton
                  title={confirmButtonTitle}
                  size="sm"
                  variant="secondary"
                  onClick={onConfirm}
                  classNames={confirmButtonClassNames}
                  disabled={confirmButtonDisabled}
                />
              ))}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  confirmButton: PropTypes.bool,
  cancelButton: PropTypes.bool,
  confirmButtonTitle: PropTypes.string,
  confirmButtonDisabled: PropTypes.bool,
  confirmButtonClassNames: PropTypes.string,
  cancelButtonClassNames: PropTypes.string,
  isSubmitting: PropTypes.bool,
};
