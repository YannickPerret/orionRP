fx_version 'cerulean'
game 'gta5'

author 'Tchoune'
description 'Orion-core'
version '1.0.0'

ui_page 'web/build/index.html'


files {
    "web/build/index.html",
    'web/build/**/*',
    'web/build/images/skinCreator/heritage/*',

    'core/shared/items.js',
    'station/gasStations.json',
    'bank/bank.json',
    'garage/garages.json',

    'core/server/migrations/*',
    'core/server/database.js',
    'core/server/playerManager.js',
    'core/server/vehicleManager.js',


    'player/player.js',
    'vehicle/vehicle.js',
    'bank/class/account.js',
    'bank/class/bank.js',
    'bank/class/card.js',
    'phone/phone.js',
    'inventory/item.js',
    'inventory/inventory.js',
    'garage/garage.js',
}
shared_scripts {
    'core/shared/notifications.js',
}


client_scripts{
    'client.js',
    'core/client/client.js',
    'player/client.js',
    'core/client/player.js',
    'core/client/utils.js',
    'core/client/commands.js',
    'core/client/dialog.js',
    'admin/commands.js',
    'events/winter/client.js',
    'vehicle/client.js',
    'station/client.js',
    'customization/client.js',
    'bank/client/client.js',
    'bank/client/invoice.js',
    'voice/client.js',
    'inventory/client.js',
    'garage/client.js',

}

server_scripts{
   'core/server/utils.js',
   'core/server/blips.js',
   'server.js',
    'player/server.js',
    'vehicle/server.js',
    'station/server.js',
    'bank/server/server.js',
    'inventory/server.js',
    'garage/server.js',
}


/*https://github.com/project-error/screenshot-basic*/






