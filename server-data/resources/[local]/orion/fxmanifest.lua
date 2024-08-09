fx_version 'cerulean'
game 'gta5'

author 'Tchoune'
description 'Orion-core'
version '1.0.0'

ui_page 'web/build/index.html'


files {
    "web/build/index.html",
    'web/build/**/*',
    'web/build/images/skinCreator/heritage/*',

    'core/shared/items.js',
    'station/gasStations.json',
    'bank/bank.json',
    'garage/garages.json',
    'job/jobs.json',

    'core/server/migrations/*',
    'core/server/database.js',
    'core/server/markerManager.js',
    'core/server/playerManager.js',
    'core/server/vehicleManager.js',
    'core/server/garageManager.js',

    'player/player.js',
    'vehicle/vehicle.js',
    'bank/class/account.js',
    'bank/class/bank.js',
    'bank/class/card.js',
    'phone/phone.js',
    'inventory/item.js',
    'inventory/inventory.js',
    'station/station.js',
    'garage/garage.js',
    'job/job.js',
}
shared_scripts {
    'core/shared/notifications.js',
    'core/shared/utils.js',
}

client_scripts{
    'core/client/loading.js',
    'target/client.js',
    'client.js',
    'core/client/client.js',
    'player/client.js',
    'core/client/player.js',
    'core/client/utils.js',
    'core/client/commands.js',
    'core/client/marker.js',
    'core/client/blip.js',
    'core/client/dialog.js',
    'admin/client/client.js',
    'admin/client/commands.js',
    'events/winter/client.js',
    'vehicle/client.js',
    'station/client.js',
    'customization/client.js',
    'bank/client/client.js',
    'bank/client/invoice.js',
    'voice/client.js',
    'inventory/client.js',
    'garage/client.js',
    'job/client.js',
}

server_scripts{
   'core/server/utils.js',
   'core/server/blips.js',
   'core/server/marker.js',
   'server.js',
    'player/server.js',
    'vehicle/server.js',
    'station/server.js',
    'bank/server/server.js',
    'inventory/server.js',
    'garage/server.js',
    'job/server.js',
    'admin/server/server.js',
    'admin/server/commands.js',
}


/*https://github.com/project-error/screenshot-basic*/






