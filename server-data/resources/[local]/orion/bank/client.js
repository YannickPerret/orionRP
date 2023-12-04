const bankCoordsJson = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'bank/bank.json'));

(async () => {
  const bankBlips = [];
  for (const bankCoords of bankCoordsJson.bank) {
    console.log(bankCoords.coords);
    createBlip(bankCoords.coords, 108, 0, 'Banque');
    bankBlips.push(bankCoords.coords);
  }
})();
