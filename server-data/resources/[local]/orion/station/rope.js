// Définition des constantes
const ROPE_LENGTH = 100; // Longueur du rope
const ROPE_WIDTH = 0.1; // Largeur du rope

// Définition de la classe Rope
class Rope {
  constructor(object, player) {
    this.object = object;
    this.player = player;

    // Création du rope
    this.rope = CreateObject(GetHashKey('prop_rope_01'), { x: 0, y: 0, z: 0 }, true, false, false);

    // Attachez le rope à l'objet
    AttachEntityToEntity(this.rope, this.object, 0, 0.0, 0.0, 0.0, 0.0, 0.0, false, true, true, false, 2, false);

    // Attachez le rope au joueur
    AttachEntityToEntity(this.rope, this.player, 0, 0.0, 0.0, 0.0, 0.0, 0.0, false, true, true, false, 2, false);

    // Définissez la longueur du rope
    SetEntityDimension(this.rope, 0, ROPE_LENGTH);
    SetEntityDimension(this.rope, 1, ROPE_WIDTH);
  }

  // Méthode pour suivre le joueur
  followPlayer() {
    // Obtenez la position du joueur
    const playerPosition = GetEntityCoords(this.player);

    // Obtenez la position du rope
    const ropePosition = GetEntityCoords(this.rope);

    // Calculez la nouvelle position du rope
    const newPosition = {
      x: playerPosition.x,
      y: playerPosition.y,
      z: playerPosition.z,
    };

    // Définissez la nouvelle position du rope
    SetEntityCoords(this.rope, newPosition);
  }
}

// Fonction pour créer le rope
function createRope(object, player) {
  // Créez le rope
  const rope = new Rope(object, player);

  // Ajoutez le rope au joueur
  this.player.rope = rope;
}

// Écoutez l'événement `onVehicleEnter`
on('onVehicleEnter', (player, vehicle) => {
  // Si le joueur est dans un véhicule, supprimez le rope
  if (player.rope) {
    DeleteObject(player.rope);
  }
});

// Écoutez l'événement `onVehicleExit`
on('onVehicleExit', (player, vehicle) => {
  // Si le joueur sort d'un véhicule, créez le rope
  if (!player.rope) {
    createRope(vehicle, player);
  }
});

// Créez le rope pour le joueur par défaut
createRope(GetVehiclePedIsUsing(-1), -1);
