fx_version 'adamant'

game 'gta5'
author 'Jupitor'
description 'K_Football American football Game'

version '1.0.1'
lua54 'yes'

client_scripts{
    'client.lua',
    'config.lua',
} 

server_scripts{
    'server.lua',
} 


escrow_ignore {
    'config.lua',
}
dependency '/assetpacks'