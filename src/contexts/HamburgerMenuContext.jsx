import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const HamburgerMenuContext = createContext();
HamburgerMenuContext._providerName = 'HamburgerMenuProvider';
HamburgerMenuContext._hookName = 'useHamburgerMenu';

export function HamburgerMenuProvider({ children }) {
  const [isShowHamburgerMenu, setIsShowHamburgerMenu] = useState(false);
  return (
    <HamburgerMenuContext.Provider value={{ isShowHamburgerMenu, setIsShowHamburgerMenu }}>
      {children}
    </HamburgerMenuContext.Provider>
  );
}

HamburgerMenuProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default HamburgerMenuContext;
