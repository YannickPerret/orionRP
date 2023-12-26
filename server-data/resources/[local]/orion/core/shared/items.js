const items = [
    // Food
    {
        name: 'food_burger',
        label: 'Burger',
        weight: 10,
        type: 'item_consumable',
        image: 'foods/hamburger.png',
        unique: false,
        useable: true,
        shouldClose: false,
        description: 'A burger',
        hunger: 30,
        animation: {
            dict: "mp_player_inteat@burger",
            name: "mp_player_int_eat_burger_fp",
            duration: 2500,
        },
        starter: {
            enabled: true,
            quantity: 10,
        }
    },
    // Drinks
    {
        name: 'drink_water',
        label: 'Water',
        weight: 10,
        type: 'item_consumable',
        image: 'drinks/watercup.png',
        unique: false,
        useable: true,
        shouldClose: false,
        description: 'A bottle of water',
        thirst: 30,
        animation: {
            dict: "mp_player_intdrink",
            name: "loop_bottle",
            duration: 2500,
        },
        starter: {
            enabled: true,
            quantity: 10,
        }
    },

    //documents
    {
        name: 'procuration_bank',
        label: 'Procuration perte de carte bancaire',
        weight: 5,
        type: 'item_standard',
        image: 'documents/procuration_bank.png',
        unique: false,
        useable: false,
        shouldClose: false,
        description: 'Procuration perte de carte bancaire',
    },
    {
        name: 'weapon_unarmed',
        label: 'Fists',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'placeholder.png',
        unique: true,
        useable: false,
        description: 'Fisticuffs'
    },
    {
        name: 'weapon_dagger',
        label: 'Dagger',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_dagger.png',
        unique: true,
        useable: false,
        description: 'A short knife with a pointed and edged blade, used as a weapon'
    },
    {
        name: 'weapon_bat',
        label: 'Bat',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_bat.png',
        unique: true,
        useable: false,
        description: 'Used for hitting a ball in sports (or other things)'
    },
    {
        name: 'weapon_bottle',
        label: 'Broken Bottle',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_bottle.png',
        unique: true,
        useable: false,
        description: 'A broken bottle'
    },
    {
        name: 'weapon_crowbar',
        label: 'Crowbar',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_crowbar.png',
        unique: true,
        useable: false,
        description: 'An iron bar with a flattened end, used as a lever'
    },
    {
        name: 'weapon_flashlight',
        label: 'Flashlight',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_flashlight.png',
        unique: true,
        useable: false,
        description: 'A battery-operated portable light'
    },
    {
        name: 'weapon_golfclub',
        label: 'Golfclub',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_golfclub.png',
        unique: true,
        useable: false,
        description: 'A club used to hit the ball in golf'
    },
    {
        name: 'weapon_hammer',
        label: 'Hammer',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_hammer.png',
        unique: true,
        useable: false,
        description: 'Used for jobs such as breaking things (legs) and driving in nails'
    },
    {
        name: 'weapon_hatchet',
        label: 'Hatchet',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_hatchet.png',
        unique: true,
        useable: false,
        description: 'A small axe with a short handle for use in one hand'
    },
    {
        name: 'weapon_knuckle',
        label: 'Knuckle',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_knuckle.png',
        unique: true,
        useable: false,
        description: 'A metal guard worn over the knuckles in fighting, especially to increase the effect of the blows'
    },
    {
        name: 'weapon_knife',
        label: 'Knife',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_knife.png',
        unique: true,
        useable: false,
        description: 'An instrument composed of a blade fixed into a handle, used for cutting or as a weapon'
    },
    {
        name: 'weapon_machete',
        label: 'Machete',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_machete.png',
        unique: true,
        useable: false,
        description: 'A broad, heavy knife used as a weapon'
    },
    {
        name: 'weapon_switchblade',
        label: 'Switchblade',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_switchblade.png',
        unique: true,
        useable: false,
        description: 'A knife with a blade that springs out from the handle when a button is pressed'
    },
    {
        name: 'weapon_nightstick',
        label: 'Nightstick',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_nightstick.png',
        unique: true,
        useable: false,
        description: 'A police officer\'s club or billy'
    },
    {
        name: 'weapon_wrench',
        label: 'Wrench',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_wrench.png',
        unique: true,
        useable: false,
        description: 'A tool used for gripping and turning nuts, bolts, pipes, etc'
    },
    {
        name: 'weapon_battleaxe',
        label: 'Battle Axe',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_battleaxe.png',
        unique: true,
        useable: false,
        description: 'A large broad-bladed axe used in ancient warfare'
    },
    {
        name: 'weapon_poolcue',
        label: 'Poolcue',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_poolcue.png',
        unique: true,
        useable: false,
        description: 'A stick used to strike a ball, usually the cue ball (or other things)'
    },
    {
        name: 'weapon_briefcase',
        label: 'Briefcase',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_briefcase.png',
        unique: true,
        useable: false,
        description: 'A briefcase for storing important documents'
    },
    {
        name: 'weapon_briefcase_02',
        label: 'Suitcase',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_briefcase2.png',
        unique: true,
        useable: false,
        description: 'Wonderful for nice vacation to Liberty City'
    },
    {
        name: 'weapon_garbagebag',
        label: 'Garbage Bag',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_garbagebag.png',
        unique: true,
        useable: false,
        description: 'A garbage bag'
    },
    {
        name: 'weapon_handcuffs',
        label: 'Handcuffs',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_handcuffs.png',
        unique: true,
        useable: false,
        description: 'A pair of lockable linked metal rings for securing a prisoner\'s wrists'
    },
    {
        name: 'weapon_bread',
        label: 'Baguette',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'baquette.png',
        unique: true,
        useable: false,
        description: 'Bread...?'
    },
    {
        name: 'weapon_stone_hatchet',
        label: 'Stone Hatchet',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_stone_hatchet.png',
        unique: true,
        useable: true,
        description: 'Stone Hatchet'
    },
    {
        name: 'weapon_candycane',
        label: 'Candy Cane',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_candycane',
        unique: true,
        useable: true,
        description: 'Candy Cane'
    },

    //Handguns
    {
        name: 'weapon_pistol',
        label: 'Walther P99',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_pistol.png',
        unique: true,
        useable: false,
        description: 'A small firearm designed to be held in one hand'
    },
    {
        name: 'weapon_pistol_mk2',
        label: 'Pistol Mk II',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_pistol_mk2.png',
        unique: true,
        useable: false,
        description: 'An upgraded small firearm designed to be held in one hand'
    },
    {
        name: 'weapon_combatpistol',
        label: 'Combat Pistol',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_combatpistol.png',
        unique: true,
        useable: false,
        description: 'A combat version small firearm designed to be held in one hand'
    },
    {
        name: 'weapon_appistol',
        label: 'AP Pistol',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_appistol.png',
        unique: true,
        useable: false,
        description: 'A small firearm designed to be held in one hand that is automatic'
    },
    {
        name: 'weapon_stungun',
        label: 'Taser',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_stungun.png',
        unique: true,
        useable: false,
        description: 'A weapon firing barbs attached by wires to batteries, causing temporary paralysis'
    },
    {
        name: 'weapon_pistol50',
        label: 'Pistol .50',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_pistol50.png',
        unique: true,
        useable: false,
        description: 'A .50 caliber firearm designed to be held with both hands'
    },
    {
        name: 'weapon_snspistol',
        label: 'SNS Pistol',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_snspistol.png',
        unique: true,
        useable: false,
        description: 'A very small firearm designed to be easily concealed'
    },
    {
        name: 'weapon_heavypistol',
        label: 'Heavy Pistol',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_heavypistol.png',
        unique: true,
        useable: false,
        description: 'A hefty firearm designed to be held in one hand (or attempted)'
    },
    {
        name: 'weapon_vintagepistol',
        label: 'Vintage Pistol',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_vintagepistol.png',
        unique: true,
        useable: false,
        description: 'An antique firearm designed to be held in one hand'
    },
    {
        name: 'weapon_flaregun',
        label: 'Flare Gun',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_FLARE',
        image: 'weapon_flaregun.png',
        unique: true,
        useable: false,
        description: 'A handgun for firing signal rockets'
    },
    {
        name: 'weapon_marksmanpistol',
        label: 'Marksman Pistol',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_marksmanpistol.png',
        unique: true,
        useable: false,
        description: 'A very accurate small firearm designed to be held in one hand'
    },
    {
        name: 'weapon_revolver',
        label: 'Revolver',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_revolver.png',
        unique: true,
        useable: false,
        description: 'A pistol with revolving chambers enabling several shots to be fired without reloading'
    },
    {
        name: 'weapon_revolver_mk2',
        label: 'Violence',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_revolver_mk2.png',
        unique: true,
        useable: true,
        description: 'da Violence'
    },
    {
        name: 'weapon_doubleaction',
        label: 'Double Action Revolver',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_doubleaction.png',
        unique: true,
        useable: true,
        description: 'Double Action Revolver'
    },
    {
        name: 'weapon_snspistol_mk2',
        label: 'SNS Pistol Mk II',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_snspistol_mk2.png',
        unique: true,
        useable: true,
        description: 'SNS Pistol MK2'
    },
    {
        name: 'weapon_raypistol',
        label: 'Up-n-Atomizer',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_raypistol.png',
        unique: true,
        useable: true,
        description: 'Weapon Raypistol'
    },
    {
        name: 'weapon_ceramicpistol',
        label: 'Ceramic Pistol',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_ceramicpistol.png',
        unique: true,
        useable: true,
        description: 'Weapon Ceramicpistol'
    },
    {
        name: 'weapon_navyrevolver',
        label: 'Navy Revolver',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_navyrevolver.png',
        unique: true,
        useable: true,
        description: 'Weapon Navyrevolver'
    },
    {
        name: 'weapon_gadgetpistol',
        label: 'Perico Pistol',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_gadgetpistol.png',
        unique: true,
        useable: true,
        description: 'Weapon Gadgetpistol'
    },
    {
        name: 'weapon_pistolxm3',
        label: 'Pistol XM3',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_pistolxm3.png',
        unique: true,
        useable: true,
        description: 'Pistol XM3'
    },

    //Submachine Guns
    {
        name: 'weapon_microsmg',
        label: 'Micro SMG',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SMG',
        image: 'weapon_microsmg.png',
        unique: true,
        useable: false,
        description: 'A handheld lightweight machine gun'
    },
    {
        name: 'weapon_smg',
        label: 'SMG',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SMG',
        image: 'weapon_smg.png',
        unique: true,
        useable: false,
        description: 'A handheld lightweight machine gun'
    },
    {
        name: 'weapon_smg_mk2',
        label: 'SMG Mk II',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SMG',
        image: 'weapon_smg_mk2.png',
        unique: true,
        useable: true,
        description: 'SMG MK2'
    },
    {
        name: 'weapon_assaultsmg',
        label: 'Assault SMG',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SMG',
        image: 'weapon_assaultsmg.png',
        unique: true,
        useable: false,
        description: 'An assault version of a handheld lightweight machine gun'
    },
    {
        name: 'weapon_combatpdw',
        label: 'Combat PDW',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SMG',
        image: 'weapon_combatpdw.png',
        unique: true,
        useable: false,
        description: 'A combat version of a handheld lightweight machine gun'
    },
    {
        name: 'weapon_machinepistol',
        label: 'Tec-9',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PISTOL',
        image: 'weapon_machinepistol.png',
        unique: true,
        useable: false,
        description: 'A self-loading pistol capable of burst or fully automatic fire'
    },
    {
        name: 'weapon_minismg',
        label: 'Mini SMG',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SMG',
        image: 'weapon_minismg.png',
        unique: true,
        useable: false,
        description: 'A mini handheld lightweight machine gun'
    },
    {
        name: 'weapon_raycarbine',
        label: 'Unholy Hellbringer',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SMG',
        image: 'weapon_raycarbine.png',
        unique: true,
        useable: true,
        description: 'Weapon Raycarbine'
    },

    // Shotguns
    {
        name: 'weapon_sawnoffshotgun',
        label: 'Sawn-off Shotgun',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SHOTGUN',
        image: 'weapon_sawnoffshotgun.png',
        unique: true,
        useable: false,
        description: 'A sawn-off smoothbore gun for firing small shot at short range'
    },
    {
        name: 'weapon_assaultshotgun',
        label: 'Assault Shotgun',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SHOTGUN',
        image: 'weapon_assaultshotgun.png',
        unique: true,
        useable: false,
        description: 'An assault version of a smoothbore gun for firing small shot at short range'
    },
    {
        name: 'weapon_bullpupshotgun',
        label: 'Bullpup Shotgun',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SHOTGUN',
        image: 'weapon_bullpupshotgun.png',
        unique: true,
        useable: false,
        description: 'A compact smoothbore gun for firing small shot at short range'
    },
    {
        name: 'weapon_musket',
        label: 'Musket',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SHOTGUN',
        image: 'weapon_musket.png',
        unique: true,
        useable: false,
        description: 'An infantryman\'s light gun with a long barrel, typically smooth-bored, muzzleloading, and fired from the shoulder'
    },
    {
        name: 'weapon_heavyshotgun',
        label: 'Heavy Shotgun',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SHOTGUN',
        image: 'weapon_heavyshotgun.png',
        unique: true,
        useable: false,
        description: 'A large smoothbore gun for firing small shot at short range'
    },
    {
        name: 'weapon_dbshotgun',
        label: 'Double-barrel Shotgun',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SHOTGUN',
        image: 'weapon_dbshotgun.png',
        unique: true,
        useable: false,
        description: 'A shotgun with two parallel barrels, allowing two single shots to be fired in quick succession'
    },
    {
        name: 'weapon_autoshotgun',
        label: 'Auto Shotgun',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SHOTGUN',
        image: 'weapon_autoshotgun.png',
        unique: true,
        useable: false,
        description: 'A shotgun capable of rapid continuous fire'
    },
    {
        name: 'weapon_pumpshotgun_mk2',
        label: 'Pumpshotgun Mk II',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SHOTGUN',
        image: 'weapon_pumpshotgun_mk2.png',
        unique: true,
        useable: true,
        description: 'Pumpshotgun MK2'
    },
    {
        name: 'weapon_combatshotgun',
        label: 'Combat Shotgun',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SHOTGUN',
        image: 'weapon_combatshotgun.png',
        unique: true,
        useable: true,
        description: 'Weapon Combatshotgun'
    },

    // Assault Rifles
    {
        name: 'weapon_assaultrifle_mk2',
        label: 'Assault Rifle Mk II',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_RIFLE',
        image: 'weapon_assaultrifle_mk2.png',
        unique: true,
        useable: true,
        description: 'Assault Rifle MK2'
    },
    {
        name: 'weapon_carbinerifle',
        label: 'Carbine Rifle',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_RIFLE',
        image: 'weapon_carbinerifle.png',
        unique: true,
        useable: false,
        description: 'A lightweight automatic rifle'
    },
    {
        name: 'weapon_carbinerifle_mk2',
        label: 'Carbine Rifle Mk II',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_RIFLE',
        image: 'weapon_carbinerifle_mk2.png',
        unique: true,
        useable: true,
        description: 'Carbine Rifle MK2'
    },
    {
        name: 'weapon_advancedrifle',
        label: 'Advanced Rifle',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_RIFLE',
        image: 'weapon_advancedrifle.png',
        unique: true,
        useable: false,
        description: 'An assault version of a rapid-fire, magazine-fed automatic rifle designed for infantry use'
    },
    {
        name: 'weapon_specialcarbine',
        label: 'Special Carbine',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_RIFLE',
        image: 'weapon_specialcarbine.png',
        unique: true,
        useable: false,
        description: 'An extremely versatile assault rifle for any combat situation'
    },
    {
        name: 'weapon_bullpuprifle',
        label: 'Bullpup Rifle',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_RIFLE',
        image: 'weapon_bullpuprifle.png',
        unique: true,
        useable: false,
        description: 'A compact automatic assault rifle'
    },
    {
        name: 'weapon_compactrifle',
        label: 'Compact Rifle',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_RIFLE',
        image: 'weapon_compactrifle.png',
        unique: true,
        useable: false,
        description: 'A compact version of an assault rifle'
    },
    {
        name: 'weapon_specialcarbine_mk2',
        label: 'Special Carbine Mk II',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_RIFLE',
        image: 'weapon_specialcarbine_mk2.png',
        unique: true,
        useable: true,
        description: 'Special Carbine MK2'
    },
    {
        name: 'weapon_bullpuprifle_mk2',
        label: 'Bullpup Rifle Mk II',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_RIFLE',
        image: 'weapon_bullpuprifle_mk2.png',
        unique: true,
        useable: true,
        description: 'Bullpup Rifle MK2'
    },
    {
        name: 'weapon_militaryrifle',
        label: 'Military Rifle',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_RIFLE',
        image: 'weapon_militaryrifle.png',
        unique: true,
        useable: true,
        description: 'Military Rifle'
    },
    // Light Machine Guns
    {
        name: 'weapon_mg',
        label: 'Machinegun',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_MG',
        image: 'weapon_mg.png',
        unique: true,
        useable: false,
        description: 'An automatic gun that fires bullets in rapid succession for as long as the trigger is pressed'
    },
    {
        name: 'weapon_combatmg',
        label: 'Combat MG',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_MG',
        image: 'weapon_combatmg.png',
        unique: true,
        useable: false,
        description: 'A combat version of an automatic gun that fires bullets in rapid succession for as long as the trigger is pressed'
    },
    {
        name: 'weapon_gusenberg',
        label: 'Thompson SMG',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_MG',
        image: 'weapon_gusenberg.png',
        unique: true,
        useable: false,
        description: 'An automatic rifle commonly referred to as a tommy gun'
    },
    {
        name: 'weapon_combatmg_mk2',
        label: 'Combat MG Mk II',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_MG',
        image: 'weapon_combatmg_mk2.png',
        unique: true,
        useable: true,
        description: 'Weapon Combatmg MK2'
    },

    // Sniper Rifles
    {
        name: 'weapon_sniperrifle',
        label: 'Sniper Rifle',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SNIPER',
        image: 'weapon_sniperrifle.png',
        unique: true,
        useable: false,
        description: 'A high-precision, long-range rifle'
    },
    {
        name: 'weapon_heavysniper',
        label: 'Heavy Sniper',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SNIPER',
        image: 'weapon_heavysniper.png',
        unique: true,
        useable: false,
        description: 'An upgraded high-precision, long-range rifle'
    },
    {
        name: 'weapon_marksmanrifle',
        label: 'Marksman Rifle',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SNIPER',
        image: 'weapon_marksmanrifle.png',
        unique: true,
        useable: false,
        description: 'A very accurate single-fire rifle'
    },
    {
        name: 'weapon_remotesniper',
        label: 'Remote Sniper',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SNIPER_REMOTE',
        image: 'weapon_remotesniper.png',
        unique: true,
        useable: false,
        description: 'A portable high-precision, long-range rifle'
    },
    {
        name: 'weapon_heavysniper_mk2',
        label: 'Heavy Sniper Mk II',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SNIPER',
        image: 'weapon_heavysniper_mk2.png',
        unique: true,
        useable: true,
        description: 'Weapon Heavysniper MK2'
    },
    {
        name: 'weapon_marksmanrifle_mk2',
        label: 'Marksman Rifle Mk II',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_SNIPER',
        image: 'weapon_marksmanrifle_mk2.png',
        unique: true,
        useable: true,
        description: 'Weapon Marksmanrifle MK2'
    },

    // Heavy Weapons
    {
        name: 'weapon_grenadelauncher',
        label: 'Grenade Launcher',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_GRENADELAUNCHER',
        image: 'weapon_grenadelauncher.png',
        unique: true,
        useable: false,
        description: 'A weapon that fires a specially-designed large-caliber projectile, often with an explosive, smoke or gas warhead'
    },
    {
        name: 'weapon_grenadelauncher_smoke',
        label: 'Smoke Grenade Launcher',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_GRENADELAUNCHER',
        image: 'weapon_smokegrenade.png',
        unique: true,
        useable: false,
        description: 'A bomb that produces a lot of smoke when it explodes'
    },
    {
        name: 'weapon_minigun',
        label: 'Minigun',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_MINIGUN',
        image: 'weapon_minigun.png',
        unique: true,
        useable: false,
        description: 'A portable machine gun consisting of a rotating cluster of six barrels and capable of variable rates of fire of up to 6,000 rounds per minute'
    },
    {
        name: 'weapon_firework',
        label: 'Firework Launcher',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_firework.png',
        unique: true,
        useable: false,
        description: 'A device containing gunpowder and other combustible chemicals that causes a spectacular explosion when ignited'
    },
    {
        name: 'weapon_railgun',
        label: 'Railgun',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_railgun.png',
        unique: true,
        useable: false,
        description: 'A weapon that uses electromagnetic force to launch high velocity projectiles'
    },
    {
        name: 'weapon_railgunxm3',
        label: 'Railgun XM3',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_railgunxm3.png',
        unique: true,
        useable: false,
        description: 'A weapon that uses electromagnetic force to launch high velocity projectiles'
    },
    {
        name: 'weapon_hominglauncher',
        label: 'Homing Launcher',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_STINGER',
        image: 'weapon_hominglauncher.png',
        unique: true,
        useable: false,
        description: 'A weapon fitted with an electronic device that enables it to find and hit a target'
    },
    {
        name: 'weapon_compactlauncher',
        label: 'Compact Launcher',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_compactlauncher.png',
        unique: true,
        useable: false,
        description: 'A compact grenade launcher'
    },
    {
        name: 'weapon_rayminigun',
        label: 'Widowmaker',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_MINIGUN',
        image: 'weapon_rayminigun.png',
        unique: true,
        useable: true,
        description: 'Weapon Rayminigun'
    },

    // Throwables
    {
        name: 'weapon_grenade',
        label: 'Grenade',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_grenade.png',
        unique: true,
        useable: false,
        description: 'A handheld throwable bomb'
    },
    {
        name: 'weapon_bzgas',
        label: 'BZ Gas',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_bzgas.png',
        unique: true,
        useable: false,
        description: 'A cannister of gas that causes extreme pain'
    },
    {
        name: 'weapon_molotov',
        label: 'Molotov',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_molotov.png',
        unique: true,
        useable: false,
        description: 'A crude bomb made of a bottle filled with a flammable liquid and fitted with a wick for lighting'
    },
    {
        name: 'weapon_stickybomb',
        label: 'C4',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_stickybomb.png',
        unique: true,
        useable: false,
        description: 'An explosive charge covered with an adhesive that when thrown against an object sticks until it explodes'
    },
    {
        name: 'weapon_proxmine',
        label: 'Proxmine Grenade',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_proximitymine.png',
        unique: true,
        useable: false,
        description: 'A bomb placed on the ground that detonates when going within its proximity'
    },
    {
        name: 'weapon_snowball',
        label: 'Snowball',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_snowball.png',
        unique: true,
        useable: false,
        description: 'A ball of packed snow, especially one made for throwing at other people for fun'
    },
    {
        name: 'weapon_pipebomb',
        label: 'Pipe Bomb',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_pipebomb.png',
        unique: true,
        useable: false,
        description: 'A homemade bomb, the components of which are contained in a pipe'
    },
    {
        name: 'weapon_ball',
        label: 'Ball',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_BALL',
        image: 'weapon_ball.png',
        unique: true,
        useable: false,
        description: 'A solid or hollow spherical or egg-shaped object that is kicked, thrown, or hit in a game'
    },
    {
        name: 'weapon_smokegrenade',
        label: 'Smoke Grenade',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_c4.png',
        unique: true,
        useable: false,
        description: 'An explosive charge that can be remotely detonated'
    },
    {
        name: 'weapon_flare',
        label: 'Flare pistol',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_FLARE',
        image: 'weapon_flare.png',
        unique: true,
        useable: false,
        description: 'A small pyrotechnic devices used for illumination and signalling'
    },

    //Miscellaneous
    {
        name: 'weapon_petrolcan',
        label: 'Petrol Can',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PETROLCAN',
        image: 'weapon_petrolcan.png',
        unique: true,
        useable: false,
        description: 'A robust liquid container made from pressed steel'
    },
    {
        name: 'weapon_fireextinguisher',
        label: 'Fire Extinguisher',
        weight: 1000,
        type: 'weapon',
        ammotype: null,
        image: 'weapon_fireextinguisher.png',
        unique: true,
        useable: false,
        description: 'A portable device that discharges a jet of water, foam, gas, or other material to extinguish a fire'
    },
    {
        name: 'weapon_hazardcan',
        label: 'Hazardous Jerry Can',
        weight: 1000,
        type: 'weapon',
        ammotype: 'AMMO_PETROLCAN',
        image: 'weapon_hazardcan.png',
        unique: true,
        useable: true,
        description: 'Weapon Hazardcan'
    },


    //Weapon Attachments
    {
        name: 'clip_attachment',
        label: 'Clip',
        weight: 1000,
        type: 'item',
        image: 'clip_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A clip for a weapon'
    },
    {
        name: 'drum_attachment',
        label: 'Drum',
        weight: 1000,
        type: 'item',
        image: 'drum_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A drum for a weapon'
    },
    {
        name: 'flashlight_attachment',
        label: 'Flashlight',
        weight: 1000,
        type: 'item',
        image: 'flashlight_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A flashlight for a weapon'
    },
    {
        name: 'suppressor_attachment',
        label: 'Suppressor',
        weight: 1000,
        type: 'item',
        image: 'suppressor_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A suppressor for a weapon'
    },
    {
        name: 'smallscope_attachment',
        label: 'Small Scope',
        weight: 1000,
        type: 'item',
        image: 'smallscope_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A small scope for a weapon'
    },
    {
        name: 'medscope_attachment',
        label: 'Medium Scope',
        weight: 1000,
        type: 'item',
        image: 'medscope_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A medium scope for a weapon'
    },
    {
        name: 'largescope_attachment',
        label: 'Large Scope',
        weight: 1000,
        type: 'item',
        image: 'largescope_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A large scope for a weapon'
    },
    {
        name: 'holoscope_attachment',
        label: 'Holo Scope',
        weight: 1000,
        type: 'item',
        image: 'holoscope_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A holo scope for a weapon'
    },
    {
        name: 'advscope_attachment',
        label: 'Advanced Scope',
        weight: 1000,
        type: 'item',
        image: 'advscope_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'An advanced scope for a weapon'
    },
    {
        name: 'nvscope_attachment',
        label: 'Night Vision Scope',
        weight: 1000,
        type: 'item',
        image: 'nvscope_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A night vision scope for a weapon'
    },
    {
        name: 'thermalscope_attachment',
        label: 'Thermal Scope',
        weight: 1000,
        type: 'item',
        image: 'thermalscope_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A thermal scope for a weapon'
    },
    {
        name: 'flat_muzzle_brake',
        label: 'Flat Muzzle Brake',
        weight: 1000, type: 'item',
        image: 'flat_muzzle_brake.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A muzzle brake for a weapon'
    },
    {
        name: 'tactical_muzzle_brake',
        label: 'Tactical Muzzle Brake',
        weight: 1000,
        type: 'item',
        image: 'tactical_muzzle_brake.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A muzzle brake for a weapon'
    },
    {
        name: 'fat_end_muzzle_brake',
        label: 'Fat End Muzzle Brake',
        weight: 1000,
        type: 'item',
        image: 'fat_end_muzzle_brake.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A muzzle brake for a weapon'
    },
    {
        name: 'precision_muzzle_brake',
        label: 'Precision Muzzle Brake',
        weight: 1000,
        type: 'item',
        image: 'precision_muzzle_brake.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A muzzle brake for a weapon'
    },
    {
        name: 'heavy_duty_muzzle_brake',
        label: 'HD Muzzle Brake',
        weight: 1000,
        type: 'item',
        image: 'heavy_duty_muzzle_brake.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A muzzle brake for a weapon'
    },
    {
        name: 'slanted_muzzle_brake',
        label: 'Slanted Muzzle Brake',
        weight: 1000,
        type: 'item',
        image: 'slanted_muzzle_brake.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A muzzle brake for a weapon'
    },
    {
        name: 'split_end_muzzle_brake',
        label: 'Split End Muzzle Brake',
        weight: 1000,
        type: 'item',
        image: 'split_end_muzzle_brake.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A muzzle brake for a weapon'
    },
    {
        name: 'squared_muzzle_brake',
        label: 'Squared Muzzle Brake',
        weight: 1000,
        type: 'item',
        image: 'squared_muzzle_brake.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A muzzle brake for a weapon'
    },
    {
        name: 'bellend_muzzle_brake',
        label: 'Bellend Muzzle Brake',
        weight: 1000,
        type: 'item',
        image: 'bellend_muzzle_brake.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A muzzle brake for a weapon'
    },
    {
        name: 'barrel_attachment',
        label: 'Barrel',
        weight: 1000,
        type: 'item',
        image: 'barrel_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A barrel for a weapon'
    },
    {
        name: 'grip_attachment',
        label: 'Grip',
        weight: 1000,
        type: 'item',
        image: 'grip_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A grip for a weapon'
    },
    {
        name: 'comp_attachment',
        label: 'Compensator',
        weight: 1000,
        type: 'item',
        image: 'comp_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A compensator for a weapon'
    },
    {
        name: 'luxuryfinish_attachment',
        label: 'Luxury Finish',
        weight: 1000,
        type: 'item',
        image: 'luxuryfinish_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A luxury finish for a weapon'
    },
    {
        name: 'digicamo_attachment',
        label: 'Digital Camo',
        weight: 1000,
        type: 'item',
        image: 'digicamo_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A digital camo for a weapon'
    },
    {
        name: 'brushcamo_attachment',
        label: 'Brushstroke Camo',
        weight: 1000,
        type: 'item',
        image: 'brushcamo_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A brushstroke camo for a weapon'
    },
    {
        name: 'woodcamo_attachment',
        label: 'Woodland Camo',
        weight: 1000,
        type: 'item',
        image: 'woodcamo_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A woodland camo for a weapon'
    },
    {
        name: 'skullcamo_attachment',
        label: 'Skull Camo',
        weight: 1000,
        type: 'item',
        image: 'skullcamo_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A skull camo for a weapon'
    },
    {
        name: 'sessantacamo_attachment',
        label: 'Sessanta Nove Camo',
        weight: 1000,
        type: 'item',
        image: 'sessantacamo_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A sessanta nove camo for a weapon'
    },
    {
        name: 'perseuscamo_attachment',
        label: 'Perseus Camo',
        weight: 1000,
        type: 'item',
        image: 'perseuscamo_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A perseus camo for a weapon'
    },
    {
        name: 'leopardcamo_attachment',
        label: 'Leopard Camo',
        weight: 1000,
        type: 'item',
        image: 'leopardcamo_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A leopard camo for a weapon'
    },
    {
        name: 'zebracamo_attachment',
        label: 'Zebra Camo',
        weight: 1000,
        type: 'item',
        image: 'zebracamo_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A zebra camo for a weapon'
    },
    {
        name: 'geocamo_attachment',
        label: 'Geometric Camo',
        weight: 1000,
        type: 'item',
        image: 'geocamo_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A geometric camo for a weapon'
    },
    {
        name: 'boomcamo_attachment',
        label: 'Boom Camo',
        weight: 1000,
        type: 'item',
        image: 'boomcamo_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A boom camo for a weapon'
    },
    {
        name: 'patriotcamo_attachment',
        label: 'Patriot Camo',
        weight: 1000,
        type: 'item',
        image: 'patriotcamo_attachment.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'A patriot camo for a weapon'
    },
    //Ammo ITEMS
    {
        name: 'pistol_ammo',
        label: 'Pistol ammo',
        weight: 200,
        type: 'item',
        image: 'pistol_ammo.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'Ammo for Pistols'
    },
    {
        name: 'rifle_ammo',
        label: 'Rifle ammo',
        weight: 1000,
        type: 'item',
        image: 'rifle_ammo.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'Ammo for Rifles'
    },
    {
        name: 'smg_ammo',
        label: 'SMG ammo',
        weight: 500,
        type: 'item',
        image: 'smg_ammo.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'Ammo for Sub Machine Guns'
    },
    {
        name: 'shotgun_ammo',
        label: 'Shotgun ammo',
        weight: 500,
        type: 'item',
        image: 'shotgun_ammo.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'Ammo for Shotguns'
    },
    {
        name: 'mg_ammo',
        label: 'MG ammo',
        weight: 1000,
        type: 'item',
        image: 'mg_ammo.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'Ammo for Machine Guns'
    },
    {
        name: 'snp_ammo',
        label: 'Sniper ammo',
        weight: 1000,
        type: 'item',
        image: 'rifle_ammo.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'Ammo for Sniper Rifles'
    },
    {
        name: 'emp_ammo',
        label: 'EMP Ammo',
        weight: 200,
        type: 'item',
        image: 'emp_ammo.png',
        unique: false,
        useable: true,
        shouldClose: true,

        description: 'Ammo for EMP Launcher'
    }
]
module.exports = items;