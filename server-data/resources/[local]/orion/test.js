const r = require("rethinkdb");

const connectionConfig = {
  host: "192.168.1.18", // ou votre adresse IP/hôte
  port: 28015, // le port de RethinkDB
  db: "orion", // le nom de la base de données
};

const newPlayer = {
  id: r.uuid(),
  steamId: "steam12345",
  license: "license12345",
  firstname: "John",
  lastname: "Doe",
  phone: "5551234",
  money: 1000,
  bank: 500,
};

r.connect(connectionConfig, function (err, conn) {
  if (err) {
    console.error("Erreur lors de la connexion à RethinkDB:", err);
  } else {
    console.log("Connecté à RethinkDB");
    // Vous pouvez ici effectuer une requête simple pour tester
    r.table("players")
      .insert(newPlayer)
      .run(conn, function (err, result) {
        if (err) {
          console.error("Erreur lors de l'insertion du joueur:", err);
        } else {
          console.log("Joueur ajouté avec succès:", result);
        }
        conn.close(); // Fermer la connexion
      });
  }
});
