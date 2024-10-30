fx_version 'cerulean'
game 'gta5'

author 'Tchoune'
description 'Core du serveur FiveM'

shared_script 'config/config.js'

files {
    'html/ui/index.html',
    'html/ui/style.css',
    'html/ui/script.js',
    'server/datas/items.json',
    'server/models/*.js',
}

client_scripts {
    'client/main.js',
    'client/*.js',
}

server_scripts {
    '@orionCore/node_modules/reflect-metadata/Reflect.js',
    'server/models/*.js',
    'server/databases/database.js',
    'server/scripts/initItems.js',
    'server/main.js',
}

ui_page 'html/ui/index.html'

