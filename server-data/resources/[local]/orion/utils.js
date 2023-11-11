const SendReactMessage = (action, data) => {
  SendNUIMessage({
    action: action,
    data: data,
  });
};

let currentResourceName = GetCurrentResourceName();

let debugIsEnabled =
  GetConvarInt("%s-debugMode".format(currentResourceName), 0) == 1;

const debugPrint = (...args) => {
  if (!debugIsEnabled) return false;

  const appendStr = args.join(" ");
  const message = `[${currentResourceName}] ${appendStr}`;
  console.log(message);
};

module.exports = {
  debugPrint,
  SendReactMessage,
};
