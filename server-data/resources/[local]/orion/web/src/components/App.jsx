import React, {useState, useEffect} from 'react';
import './App.css'

const App = () => {
  const [playerData, setPlayerData] = useState({ firstname: '', lastname: '', money: 0 });
  const [showNui, setShowNui] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      const { action, data } = event.data;
      if (action === "setPlayerData") {
        console.log(data)
        setPlayerData(data);
        setShowNui(true);
      } else if (action === "closeNUI") {
        setShowNui(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!showNui) {
    return null;
  }

  return (
    <div className="playerInfo">
      <header>
        <h1>{playerData.firstname} {playerData.lastname}</h1>
      </header>
      <div>
        <ul>
          <li>Argent liquide : ${playerData.money}</li>
        </ul>
      </div>
    </div>
  );
};

export default App;