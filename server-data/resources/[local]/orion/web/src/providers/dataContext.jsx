import React, { useState, createContext, useContext } from 'react';

export const DataContext = createContext();

const initialState = {
  voice: {
    voiceConnected: false,
    voiceToggle: false
  },
  player: {
    firstname: 'John',
    lastname: 'Doe',
    hunger: 100,
    thirst: 100,
    drunk: 0,
    drogue: 0,
    phone: '06 06 06 06 06',
    money: 0,
    inventory: [],
    account: {},
    card: {},
    skin: {},
  },
  job: {
    name: 'Chômeur',
    grade: 'Aucun',
    salary: 0,
  },
  vehicle: {
    fuel: 100,
    speed: 0,
    seatbelt: false,
    isDriver: false,
    inventory: [],
  },
  garage: {},
  bankMaxWithdraw: 0,
  isPlayerDead: false,
  playerDeadMessage: '',
  dialogData: {},
  targetOptions: [],
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
