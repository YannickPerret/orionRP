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
}
shared_scripts {
    'core/config.js',
    'core/notifications.js',
    'core/utils.js',

}

client_scripts{

}

server_scripts{
    'core/playerManager.js',
    'core/vehicleManager.js',
    'player/player.js',
    'vehicle/vehicle.js',
    'server.js',
    'player/server.js',
    'vehicle/server.js',
    'station/server.js',
}



