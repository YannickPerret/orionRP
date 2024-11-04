import React, { useState } from "react";
import { NuiProvider, useNuiEvent } from "fivem-nui-react-lib";
import TargetMenu from './components/TargetMenu'

function App() {
    const [showTargetMenu, setShowTargetMEnu] = useState(false);
    const [currentTarget, setCurrentTarget] = useState(null);


    useNuiEvent("targetMenu", "openTargetMenu", (data) => {
        setShowTargetMEnu(data.show);
        setCurrentTarget(data.target)
    });

    return (
        <NuiProvider resource="targetMenu">
            {showTargetMenu && <TargetMenu target={currentTarget} />}
        </NuiProvider>
    );
}

export default App;
