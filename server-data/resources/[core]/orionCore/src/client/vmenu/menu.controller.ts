import { Injectable, Command } from '../../core/decorators';

@Injectable()
export class MenuController {
    private menu: any;

    initialize() {
        this.createMenu();
    }

    createMenu() {
        // Créer un menu en utilisant l'export de MenuV
        this.menu = exports.menuv.CreateMenu('Menu Principal', 'Bienvenue dans MenuV', 'topright', 255, 0, 0, 'size-125', 'default', 'menuv');

        // Ajouter des éléments au menu
        const button1 = this.menu.AddButton({
            icon: '🔥',
            label: 'Option 1',
            description: 'Description de l\'option 1',
            value: 'option1',
        });

        button1.On('select', () => {
            emit('chat:addMessage', { args: ['Système', 'Option 1 sélectionnée !'] });
        });

        const button2 = this.menu.AddButton({
            icon: '🚀',
            label: 'Option 2',
            description: 'Description de l\'option 2',
            value: 'option2',
        });

        button2.On('select', () => {
            emit('chat:addMessage', { args: ['Système', 'Option 2 sélectionnée !'] });
        });
    }

    @Command({ name: 'openMenu', description: 'Ouvre le menu principal', role: null })
    openMenu() {
        exports.menuv.OpenMenu(this.menu);
    }
}
