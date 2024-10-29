fx_version 'cerulean'
game 'gta5'

author 'Tchoune'
description 'Core du serveur FiveM'

shared_script 'config/config.js'

client_scripts {
    'client/main.js',
    'client/player.js',
    'client/hunger.js',
    'client/death.js',
    'client/inventory.js' 
}

server_scripts {
    '@[core]/node_modules/reflect-metadata/Reflect.js', 
    'server/app.js',
    'server/**/*.js',
}

ui_page 'html/ui/index.html'

files {
    'html/ui/index.html',
    'html/ui/style.css',
    'html/ui/script.js',
    'html/ui/images/*.*',
}