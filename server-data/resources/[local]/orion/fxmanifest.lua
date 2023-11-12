fx_version 'cerulean'
game 'gta5'

author 'An awesome dude'
description 'An awesome, but short, description'
version '1.0.0'

resource_type 'gametype' { name = 'My awesome game type!' }

ui_page 'web/build/index.html'

files {
    "web/build/index.html",
    'web/build/**/*',
}

client_scripts {
    'client.js',
    'utils.js',
    'player/client.js'
}

server_scripts {
    'server.js',
    'player/server.js'
}