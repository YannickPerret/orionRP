fx_version 'cerulean'
game 'gta5'

author 'Tchoune'
description 'The good description'
version '1.0.0'

ui_page 'web/build/index.html'

files {
    "web/build/index.html",
    'web/build/**/*',
    'web/build/images/skinCreator/heritage/*',

    'station/gasStations.json',
    'bank/bank.json',

    'core/server/playerManager.js',
    'core/server/vehicleManager.js',

    'phone/phone.js',
    'player/player.js',
    'vehicle/vehicle.js',
    'bank/account.js',
    'bank/bank.js',
    'bank/card.js',

    'player/server.js',
    'vehicle/server.js',
    'station/server.js',
    'bank/server.js',
}

shared_scripts {
    'core/shared/notifications.js',
}

client_scripts{
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
    'bank/client.js',
}

server_scripts{
    'core/server/server.js',
}