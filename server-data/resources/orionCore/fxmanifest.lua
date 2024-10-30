fx_version 'cerulean'
game 'gta5'

author 'Tchoune'
description 'Core du serveur FiveM'

ui_page 'html/ui/index.html'


shared_script 'config/config.js'

files {
    'html/ui/index.html',
    'html/ui/style.css',
    'html/ui/script.js',
    'server/datas/items.json',
    'server/models/User.js',
    'server/models/Inventory.js',
    'server/models/InventoryItem.js',
    'server/models/Item.js',
    'server/models/Vehicle.js',
    'server/models/Character.js',
     'server/controllers/*.js',
    'server/events/*.js',
    'server/utils/*.js',
    'server/databases/database.js',
    'server/scripts/initItems.js',
}

client_scripts {
    'client/main.js',
}

server_scripts {
    '@orionCore/node_modules/reflect-metadata/Reflect.js',
    'server/main.js',
}


