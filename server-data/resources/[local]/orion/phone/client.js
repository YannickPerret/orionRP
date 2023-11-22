RegisterCommand(
  "sendMessage",
  (source, args) => {
    let message = args.join(" ");
    if (message) {
      emitNet("phone:sendMessage", source, message);
    }
  },
  false
);
RegisterCommand(
  "call",
  (source, args) => {
    let number = args[0];
    if (number) {
      emitNet("phone:call", source, number);
    }
  },
  false
);

RegisterCommand(
  "hangup",
  (source, args) => {
    emitNet("phone:hangup", source);
  },
  false
);

exports("sendMessage", (message) => {
  if (message) {
    emitNet("phone:sendMessage", source, message);
  }
});

exports("call", (number) => {
  if (number) {
    emitNet("phone:call", source, number);
  }
});
