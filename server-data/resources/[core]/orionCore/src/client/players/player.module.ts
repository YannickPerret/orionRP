import { PlayerController } from './player.controller';

export class PlayerModule {
    constructor() {
        // Initialisation du contrôleur avec injection des services
        new PlayerController();
    }
}
