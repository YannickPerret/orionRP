fx_version 'cerulean'
game 'gta5'

author 'An awesome dude'
description 'An awesome, but short, description'
version '1.0.0'

resource_type 'Roleplay' { name = 'My awesome game type!' }

ui_page 'web/build/index.html'

files {
    "web/build/index.html",
    'web/build/**/*',
}

server_scripts {
    'server.js',
    'utils/utils.js',
    'utils/notification.js',
    'player/server.js',
    'vehicles/server.js'
}

client_scripts {
    'client.js',
    'utils/utils.js',
    'utils/notification.js',
    'player/client.js',
    'vehicles/client.js'
}

