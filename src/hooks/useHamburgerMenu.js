import { useContext } from 'react';
import HamburgerMenuContext from '../contexts/HamburgerMenuContext';

export default function useHamburgerMenu() {
  const context = useContext(HamburgerMenuContext);

  if (!context) {
    throw new Error('"useHamburgerMenu" must be used within "HamburgerMenuProvider"');
  }

  return context;
}
