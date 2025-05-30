import './App.css';

function App() {
  return (
      <div className="relative bg-black w-full h-screen">
          <video autoPlay loop muted className="absolute w-full h-full object-cover top-0 left-0">
              <source src={'/videos/loading.mp4'} type="video/mp4"/>
              Votre navigateur ne supporte pas la vidéo.
          </video>
          <div className={"absolute flex flex-col bg-teal-400 top-1/3 left-4 rounded-lg p-8 w-96 h-96"}>
              <header className={"flex justify-center text-2xl text-white"}>
                  News et patchs
              </header>
              <div className={"flex flex-col"}>
                  <ul>
                      <li>Testtt</li>
                  </ul>
              </div>
          </div>

          <footer>
              <audio src={'/sounds/ambiant.mp3'} autoPlay loop hidden/>
          </footer>
      </div>
  );
}

export default App;
