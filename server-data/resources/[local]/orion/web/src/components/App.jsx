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
  const [showNui, setShowNui] = useState(false);

  //const [clientData, setClientData] = useState(null)

  /*const handleGetClientData = () => {
    fetchNui('getClientData').then(retData => {
      console.log('Got return data from client scripts:')
      console.dir(retData)
      setClientData(retData)
    }).catch(e => {
      console.error('Setting mock data due to error', e)
      setClientData({ x: 500, y: 300, z: 200})
    })
  }*/

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const { action } = event.data;
      if (action === "openNUI") {
        setShowNui(true);
      }
    });
  }, []);

  const handleClose = () => {
    setShowNui(false);
    // Envoyer un message au client FiveM pour fermer la NUI
    fetch(`https://${GetParentResourceName()}/closeNUI`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ action: "close" })
    });
  };

  if (!showNui) {
    return null;
  }


  return (
    <div className="nui-container">
      {/* Votre interface NUI ici */}
      <button onClick={handleClose}>Fermer la NUI</button>
    </div>
  );
}

export default App;