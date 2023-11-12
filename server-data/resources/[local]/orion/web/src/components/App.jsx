import React, {useState, useEffect} from 'react';
import './App.css'
import {debugData} from "../utils/debugData";
import {fetchNui} from "../utils/fetchNui";

// This will set the NUI to visible if we are
// developing in browser
debugData([
  {
    action: 'setVisible',
    data: true,
  }
])


const ReturnClientDataComp = ({data}) => (
  <>
    <h5>Returned Data:</h5>
    <pre>
      <code>
        {JSON.stringify(data, null)}
      </code>
    </pre>
  </>
)

const App = () => {
  const [playerData, setPlayerData] = useState(null);
  const [showNui, setShowNui] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      const { action, data } = event.data;
      if (action === "setPlayerData") {
        setPlayerData(data);
        setShowNui(true); // Afficher l'interface utilisateur
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
          <li>Argent liquide : {playerData.money}</li>
        </ul>
      </div>
    </div>
  );
}

export default App;