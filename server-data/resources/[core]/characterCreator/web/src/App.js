import React, { useState } from "react";
import { NuiProvider, useNuiEvent } from "fivem-nui-react-lib";
import CharacterCreation from "./components/CharacterCreation";

function App() {
    const [showCharacterCreation, setShowCharacterCreation] = useState(false);

    useNuiEvent("characterCreator", "openCharacterCreation", (data) => {
        setShowCharacterCreation(data);
    });

    return (
        <NuiProvider resource="orion">
            {showCharacterCreation && <CharacterCreation />}
        </NuiProvider>
    );
}

export default App;
