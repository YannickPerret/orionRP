RegisterCommand(
  'save',
  async (source, args) => {
    const playerPed = GetPlayerPed(-1);
    const position = GetEntityCoords(playerPed, true);
    emitNet('orion:savePlayerPosition', position[0], position[1], position[2]);
  },
  false
);



RegisterCommand('pos', (source, args) => {
  const pos = GetEntityCoords(GetPlayerPed(-1));
  const heading = GetEntityHeading(GetPlayerPed(-1));
  emit('chat:addMessage', {
    args: [`X: ${pos[0].toFixed(2)}, Y: ${pos[1].toFixed(2)}, Z: ${pos[2].toFixed(2)}, Heading: ${heading.toFixed(2)}`],
  });
});
