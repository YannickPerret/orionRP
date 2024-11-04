fx_version 'cerulean'
game 'gta5'

author 'Tchoune'
description 'Core du serveur FiveM'

loadscreen 'index.html'
loadscreen_manual_shutdown 'yes'
loadscreen_cursor 'false'

shared_script 'config/config.js'

files {
    'server/datas/items.json',
    'server/services/*.js',
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
    'client/helpers/*.js',
    'client/events/*.js',
    'client/commands/*.js',
    'client/gazStation.js',
    'client/vehicle.js',
    'client/player.js',
    'client/main.js',
}

server_scripts {
    '@orionCore/node_modules/reflect-metadata/Reflect.js',
    'server/commands/**/*.js',
    'server/main.js',
}


