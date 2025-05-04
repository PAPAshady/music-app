import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import BgImage from '../../../assets/images/backgrounds/login-signup-page.jpg';
import { ArrowLeft, Menu } from 'iconsax-react';
import PropTypes from 'prop-types';
export default function MobilePlaylist({ isOpen, onClose }) {
  const [isTopbarVisible, setIsTopbarVisible] = useState(false);

  // remove scrollbar for the body when mobile playlist is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  const handleScroll = (e) => {
    if (e.target.scrollTop <= 30) {
      setIsTopbarVisible(false);
    } else {
      setIsTopbarVisible(true);
    }
  };

  return createPortal(
    <div
      className={`bg-primary-800 fixed inset-0 z-10 h-full min-h-[100dvh] w-full overflow-hidden transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
    >
      <div
        className="absolute size-full bg-cover bg-center bg-no-repeat opacity-20 blur-md"
        style={{ backgroundImage: `url(${BgImage})` }}
      ></div>

      <div
        className="text-secondary-50 relative container mx-auto h-[100dvh] overflow-y-auto py-12"
        onScroll={handleScroll}
      >
        <div
          className={`fixed top-0 left-0 flex w-full items-center justify-between border-b-2 px-2 py-3 transition-all duration-300 ${isTopbarVisible ? 'border-neutral-700 bg-neutral-800' : 'border-transparent'}`}
        >
          <div className="flex items-center gap-3">
            <button onClick={onClose}>
              <ArrowLeft size={24} />
            </button>
            <p
              className={`transition-opacity duration-300 ${isTopbarVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              Album name
            </p>
          </div>
          <button className="">
            <Menu size={24} />
          </button>
        </div>
        <div></div>
      </div>
    </div>,
    document.getElementById('mobilePlaylist')
  );
}

MobilePlaylist.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
