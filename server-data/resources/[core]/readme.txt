my-fivem-server/
├── server-data/
│   ├── resources/
│   │   ├── [core]/
│   │   │   ├── client/
│   │   │   │   ├── main.js
│   │   │   │   └── ... (autres scripts clients)
│   │   │   ├── server/
│   │   │   │   ├── main.js                 // Point d'entrée du serveur (app.js renommé)
│   │   │   │   ├── ormconfig.js            // Configuration TypeORM
│   │   │   │   ├── models/                 // Modèles TypeORM (entités)
│   │   │   │   │   ├── Player.js
│   │   │   │   │   ├── Inventory.js
│   │   │   │   │   ├── InventoryItem.js
│   │   │   │   │   ├── Item.js
│   │   │   │   │   └── Vehicle.js
│   │   │   │   ├── controllers/            // Logique métier
│   │   │   │   │   ├── playerController.js
│   │   │   │   │   ├── inventoryController.js
│   │   │   │   │   ├── itemController.js
│   │   │   │   │   └── vehicleController.js
│   │   │   │   ├── events/                 // Gestionnaires d'événements
│   │   │   │   │   ├── playerEvents.js
│   │   │   │   │   ├── inventoryEvents.js
│   │   │   │   │   └── itemEvents.js
│   │   │   │   ├── scripts/                // Scripts d'initialisation
│   │   │   │   │   └── initItems.js
│   │   │   │   ├── utils/                  // Utilitaires
│   │   │   │   │   └── dateUtils.js
│   │   │   │   ├── services/               // Services (ex: Redis)
│   │   │   │   │   └── redisService.js
│   │   │   │   ├── data/                   // Données (ex: items.json si nécessaire)
│   │   │   │   │   └── items.json
│   │   │   │   └── package.json
│   │   │   ├── fxmanifest.lua
│   │   │   └── package.json                // Fichier NPM principal
│   │   └── ... (autres ressources)
└── ... (autres dossiers)
