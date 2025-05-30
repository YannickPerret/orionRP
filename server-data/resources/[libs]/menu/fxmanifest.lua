fx_version 'cerulean'
game 'common'

name "menu"
description 'A script can open menu with a lot of features'

client_scripts {
    'client/*.js',
}

exports {
    'CreateMenu',
    'CreateSubmenu',
    'CloseMenu',
    'CloseSubmenu',
    'ResetMenu'
}