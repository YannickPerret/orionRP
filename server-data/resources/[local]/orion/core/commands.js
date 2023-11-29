RegisterCommand(
  'save',
  async (source, args) => {
    const playerPed = GetPlayerPed(-1);
    const position = GetEntityCoords(playerPed, true);
    emitNet('orion:savePlayerPosition', position[0], position[1], position[2]);
  },
  false
);

RegisterCommand(
  'openPlayerMenu',
  () => {
    emitNet('orion:getPlayerData');
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

RegisterCommand('veh', (source, args) => {
  const model = args[0];
  console.log(model);
  const ped = GetPlayerPed(-1);
  const coords = GetEntityCoords(ped);
  RequestModel(model);
  const vehicle = CreateVehicle(model, coords[0], coords[1], coords[2], GetEntityHeading(ped), true, false);
  SetPedIntoVehicle(ped, vehicle, -1);
  SetEntityAsNoLongerNeeded(vehicle);
  SetModelAsNoLongerNeeded(model);
});
