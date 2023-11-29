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

client_scripts{
    'player/player.js',
    'client.js',
    'player/client.js',
}

server_scripts{
    'player/player.js',
    'server.js',
    'player/server.js',
}

/*
server_scripts {
    'server.js',
    'utils/utils.js',
    'utils/notification.js',
    'player/server.js',
    'player/player.js',
    'vehicle/server.js',
    'phone/server.js',
    'phone/phone.js',


}

client_scripts {
    'client.js',
    'utils/utils.js',
    'utils/player.js',
    'system/commands.js',
    'utils/notification.js',
    'player/client.js',
    'vehicle/client.js',
    'phone/client.js',
    'events/winter/client.js',
}*/

