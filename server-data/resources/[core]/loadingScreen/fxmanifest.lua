fx_version 'cerulean'
game 'gta5'

author 'Tchoune'
description 'Core du serveur FiveM'

loadscreen 'web/build/index.html'
loadscreen_manual_shutdown 'yes'
loadscreen_cursor 'false'


files {
     'web/build/index.html',
     'web/build/static/css/*.*',
     'web/build/static/js/*.*',
     'web/build/sounds/*.*',
     'web/build/images/*.*'
}

client_scripts {
    'client/main.js',
}

server_scripts {
    'server/main.js',
}


