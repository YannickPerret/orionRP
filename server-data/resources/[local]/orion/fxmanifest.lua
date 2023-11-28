fx_version 'cerulean'
game 'gta5'

author 'Tchoune'
description 'The good description'
version '1.0.0'

resource_type 'Roleplay' { name = 'My awesome game type!' }

ui_page 'web/build/index.html'

files {
    "web/build/index.html",
    'web/build/**/*',
    'web/build/images/skinCreator/heritage/*',
}

server_scripts {
    'server.js',
    'utils/utils.js',
    'utils/notification.js',
    'player/server.js',
    'vehicle/server.js',
    'phone/server.js'
}

client_scripts {
    'client.js',
    'utils/utils.js',
    'utils/player.js',
    'utils/notification.js',
    'player/client.js',
    'vehicle/client.js',
    'phone/client.js'
}

