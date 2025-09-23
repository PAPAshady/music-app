import PropTypes from 'prop-types';
import { Music } from 'iconsax-react';
import { useState } from 'react';

function DesktopSearchBox({ isVisible }) {
  const [activeButton, setActiveButton] = useState('all');

  const filterButtons = [
    { id: 1, text: 'all' },
    { id: 2, text: 'tracks' },
    { id: 3, text: 'artists' },
    { id: 4, text: 'albums' },
    { id: 5, text: 'playlists' },
  ];

  return (
    <div
      className={`text-secondary-50 absolute z-[-1] -mt-4 max-h-[450px] w-full rounded-md bg-gradient-to-b from-slate-800 to-slate-700 px-4 py-8 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}
    >
      <div className="flex items-center gap-2">
        {filterButtons.map((button) => (
          <FilterButton
            key={button.id}
            isActive={button.text === activeButton}
            onClick={() => setActiveButton(button.text)}
            {...button}
          />
        ))}
      </div>
      <div className="dir-ltr mt-4 flex h-[300px] flex-col items-center justify-center gap-3 rounded-md border border-dashed px-8 text-center">
        <Music size={72} />
        <p className="text-2xl font-semibold">Let the music begin</p>
        <p className="text-">You can now start searching for your tunes!</p>
      </div>
    </div>
  );
}

function FilterButton({ text, isActive, onClick }) {
  return (
    <button
      className={`text-secondary-100 cursor-pointer rounded-full border border-transparent bg-slate-600 px-3 py-1.5 text-sm capitalize transition-colors hover:border-slate-500 ${isActive && 'outline-1'}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

DesktopSearchBox.propTypes = { isVisible: PropTypes.bool };
FilterButton.propTypes = {
  text: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};

export default DesktopSearchBox;
