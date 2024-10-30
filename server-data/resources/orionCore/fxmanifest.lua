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
    'server/models/User.js',
    'server/models/Inventory.js',
    'server/models/InventoryItem.js',
    'server/models/Item.js',
    'server/models/Vehicle.js',
    'server/models/Character.js',
    'server/scripts/initItems.js',
    'server/databases/database.js',
    'server/main.js',
}

ui_page 'html/ui/index.html'

