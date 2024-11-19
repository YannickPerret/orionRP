import './App.css';
import { NuiProvider } from './libs/nui';

function App() {
  return (
      <NuiProvider resource="orionCore">
          <div className="App">
              <h1 className="text-3xl font-bold underline">
                  Hello world!
              </h1>
          </div>
      </NuiProvider>
  );
}

export default App;
