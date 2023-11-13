import bucle from "../assets/sounds/buckle.ogg";
import unbucle from "../assets/sounds/unbuckle.ogg";

export const playSound = (soundName, volume = 1) => {
  let soundToPlay;
  switch (soundName) {
    case "buckle":
      soundToPlay = bucle;
      break;
    case "unbuckle":
      soundToPlay = unbucle;
      break;
    default:
      return;
  }
  const audio = new Audio(soundToPlay);
  audio.volume = volume;
  audio.play();
};
