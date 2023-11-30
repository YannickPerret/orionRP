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
}
shared_scripts {
    'core/config.js',
    'core/playerManager.js',
    'core/vehicleManager.js',
    'core/notifications.js',
}

client_scripts{
    'client.js',
    'player/client.js',
    'core/utils.js',
    'core/player.js',
    'core/commands.js',
    'admin/commands.js',
    'events/winter/client.js',
    'vehicle/client.js',
    'station/client.js',
}

server_scripts{
    'server.js',
    'player/server.js',
    'core/utils.js',
    'vehicle/vehicle.js',
    'vehicle/server.js',
    'station/server.js',
}
