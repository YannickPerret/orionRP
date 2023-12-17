import React, { useState, createContext } from 'react';

export const DataContext = createContext();

const initialState = {
  window: {
    main: false,
    skinCreator: false,
    bank: false
  },
  menu: {
    playerMenu: false,
    jobMenu: false,
    amountMenu: false,
    skinCreator: false,
    bankInterface: false,
    fuel: false
  },
  voice: {
    voiceConnected: false,
    voiceToggle: false
  },
  player: {
    firstname: 'John',
    lastname: 'Doe',
    phone: '06 06 06 06 06'
  },
  account: {
    money: 100,
    bank: 1000
  },
  job: {
    name: 'Chômeur',
    grade: 'Aucun',
    salary: 0
  },
  vehicle: {
    pedInVehicle: false,
    fuel: 100,
    speed : 0,
    seatbelt: false,
    isDriver: false,
  },
  isPlayerDead: false,
  playerDeadMessage: '',
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(initialState);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData doit être utilisé à l\'intérieur d\'un DataProvider');
  }
  return context;
};
