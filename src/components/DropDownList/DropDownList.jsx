import { cloneElement } from 'react';
import { Menu as MenuIcon } from 'iconsax-reactjs';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import PropTypes from 'prop-types';

export default function DropDownList({
  menuButtonIcon = <MenuIcon />,
  menuItems,
  dropDownPlacement = 'bottom start',
}) {
  const styledMenuButtonIcon = cloneElement(menuButtonIcon, { size: '100%' });
  return (
    <Menu>
      <div className="relative">
        <MenuButton className="hover:bg-primary-700 text-secondary-100 data-[open]:bg-primary-700 hover:text-secondary-50 size-8 rounded-md p-1 transition-colors duration-300">
          {styledMenuButtonIcon}
        </MenuButton>
        <MenuItems
          transition
          anchor={dropDownPlacement}
          className="text-primary-50 bg-primary-500/60 absolute top-3 right-2 z-10 mt-1 flex !max-w-max flex-col gap-1 rounded-md p-1 backdrop-blur-sm transition duration-200 data-[closed]:translate-y-2 data-[closed]:opacity-0"
        >
          {menuItems.map((listItem) => (
            <DropDownListItem key={listItem.id} {...listItem} />
          ))}
        </MenuItems>
      </div>
    </Menu>
  );
}

function DropDownListItem({ icon, title, onClick }) {
  const styledIcon = cloneElement(icon, { size: '100%' });

  const clickHandler = async (e, closeHandler) => {
    e.preventDefault();
    await onClick?.();
    closeHandler();
  };

  return (
    <MenuItem>
      {({ close }) => (
        <button
          className="hover:bg-primary-400/60 min-w-[130px] cursor-default"
          onClick={(e) => clickHandler(e, close)}
        >
          <div className="flex items-center gap-2 p-2 text-start text-sm">
            <span className="size-5">{styledIcon}</span>
            <span>{title}</span>
          </div>
        </button>
      )}
    </MenuItem>
  );
}

DropDownList.propTypes = {
  menuButtonIcon: PropTypes.element,
  menuItems: PropTypes.array.isRequired,
  dropDownPlacement: PropTypes.oneOf([
    'top',
    'top start',
    'top end',
    'right',
    'right start',
    'right end',
    'bottom',
    'bottom start',
    'bottom end',
    'left',
    'left start',
    'left end',
  ]),
};

DropDownListItem.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
