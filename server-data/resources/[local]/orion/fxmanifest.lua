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

    'station/gasStations.json',
    'bank/bank.json',

    'core/server/database.js',
    'core/server/playerManager.js',
    'core/server/vehicleManager.js',

    'player/player.js',
    'vehicle/vehicle.js',
    'bank/class/account.js',
    'bank/class/bank.js',
    'bank/class/card.js',
    'phone/phone.js',
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
    'admin/commands.js',
    'events/winter/client.js',
    'vehicle/client.js',
    'station/client.js',
    'customization/client.js',
    'bank/client/client.js',
    'bank/client/invoice.js',
}

server_scripts{
   'core/server/utils.js',
   'server.js',
    'player/server.js',
    'vehicle/server.js',
    'station/server.js',
    'bank/server/server.js',
}









