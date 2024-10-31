fx_version 'cerulean'
game 'gta5'

author 'Tchoune'
description 'Core du serveur FiveM'

ui_page 'web/build/index.html'

shared_script 'config/config.js'

client_scripts {
    'client/main.js',
}

server_scripts {
    'server/commands.js',
    'server/main.js',
}

files {
    'web/build/static/**/*.*',
    'web/build/static/**/*.*',
    'web/build/index.html',
}