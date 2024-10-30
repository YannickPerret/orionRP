fx_version 'cerulean'
game 'gta5'

author 'Tchoune'
description 'Core du serveur FiveM'

shared_script 'config/config.js'

client_scripts {
    'client/main.js',
    'client/*.js',
}

server_script 'server/main.js'


ui_page 'html/ui/index.html'

files {
    'html/ui/index.html',
    'html/ui/style.css',
    'html/ui/script.js',
    'html/ui/images/*.*',
    'server/data/items.json',
}