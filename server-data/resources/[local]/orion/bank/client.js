const bankCoordsJson = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'bank/bank.json'));

(async () => {
  const bankBlips = [];
  for (const bankCoords of bankCoordsJson) {
    createBlip(bankCoords.coords, 108, 0, 'Banque');
  }
})();
