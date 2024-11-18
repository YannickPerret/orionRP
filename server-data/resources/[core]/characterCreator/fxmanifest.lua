fx_version 'cerulean'
game 'gta5'

author 'Tchoune'
description 'Core du serveur FiveM'

ui_page 'web/build/index.html'

shared_script 'config/config.js'

client_scripts {
    '@menuv/menuv.lua',
    'client/main.js',
}

server_scripts {
    'server/main.js',
}

files {
    'web/build/images/heritages/*.*',
    'web/build/static/**/*.*',
    'web/build/static/**/*.*',
    'web/build/index.html',
}