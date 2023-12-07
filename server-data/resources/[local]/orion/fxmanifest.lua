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
    'core/lib/playerManager.js',
    'core/lib/vehicleManager.js',
    'phone/phone.js',
    'player/player.js',
    'vehicle/vehicle.js',
    'bank/account.js',
    'bank/bank.js',
    
    
}
shared_scripts {
    'core/shared/notifications.js',
}

client_scripts{
    'client.js',
    'player/client.js',
    'core/player.js',
    'core/utils.js',
    'core/commands.js',
    'admin/commands.js',
    'events/winter/client.js',
    'vehicle/client.js',
    'station/client.js',
    'customization/client.js',
    'bank/client.js',
}

server_scripts{
    'server.js',
    'player/server.js',
    'vehicle/server.js',
    'station/server.js',
    'bank/server.js',
}





