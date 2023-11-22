import React, { useState, useEffect } from 'react';
import '../styles/SideMenu.css';

export const SideMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleKeyDown = (e) => {
    if (e.key === "F2") {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
