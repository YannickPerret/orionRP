import './App.css';

function App() {
  return (
      <div className="relative bg-black w-full h-screen">
          <img src={'images/screenload1.jpg'} alt={'loading'} className={'object-contain w-full h-full'}/>
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
              <audio src={'sounds/ambiant.mp3'} autoPlay={true} loop={true} controls={true} />
          </footer>
      </div>
  );
}

export default App;
