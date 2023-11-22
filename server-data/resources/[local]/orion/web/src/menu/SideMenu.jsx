import React, { useEffect } from 'react'
import { sendNui } from '../utils/fetchNui'
import '../styles/SideMenu.css'

export const SideMenu = ({handleSideMenuIsOpen, children}) => {

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F2") {
        handleSideMenuIsOpen(false);
        sendNui('closeNUI', null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSideMenuIsOpen]);

  return (
    <div className='SideMenu'>
      <header className='SideMenu__header'>
        {children[0]}
      </header>
      <div className='SideMenu__body'>
        {children[1]}
      </div>
    </div>
  );
};
