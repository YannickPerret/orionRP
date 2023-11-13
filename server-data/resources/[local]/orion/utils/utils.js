exports("SendReactMessage", (action, data) => {
  SendNUIMessage({
    action: action,
    data: data,
  });
});

let currentResourceName = GetCurrentResourceName();

let debugIsEnabled = GetConvarInt(`${currentResourceName}-debugMode`, 0) == 1;

exports("debugPrint", (...args) => {
  if (!debugIsEnabled) return false;

  const appendStr = args.join(" ");
  const message = `[${currentResourceName}] ${appendStr}`;
  console.log(message);
});

function Delay(ms) {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}

exports("Delay", Delay);
