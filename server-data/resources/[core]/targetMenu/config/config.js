global.config = {
    targetMenu: {
        MaxDistance: 7.0,
        EnableOutline: false,
        DrawSprite: true,
        OpenKey: 'LMENU',
        MenuControlKey: 238,
        DisableControls: true,
        boneList: {
            option: {},
            vehicle: [
                'chassis', 'windscreen', 'seat_pside_r', 'seat_dside_r', 'bodyshell', 'suspension_lm', 'suspension_lr', 'platelight', 'attach_female', 'attach_male', 'bonnet', 'boot', 'chassis_dummy', 'chassis_Control', 'door_dside_f', 'door_dside_r', 'door_pside_f', 'door_pside_r', 'Gun_GripR', 'windscreen_f', 'platelight', 'VFX_Emitter', 'window_lf', 'window_lr', 'window_rf', 'window_rr', 'engine', 'gun_ammo', 'ROPE_ATTATCH', 'wheel_lf', 'wheel_lr', 'wheel_rf', 'wheel_rr', 'exhaust', 'overheat', 'seat_dside_f', 'seat_pside_f', 'Gun_Nuzzle', 'seat_r'
            ],
        },
        targetActions: {
            player: [
                {
                    label: "Soigner",
                    action: {
                        type: 'server',
                        event: 'jobs:medic:client:healPlayer',
                        args: null
                    },
                    icon: "FaMedkit",
                    permission: { job: "medic" },
                    role: "user",
                    animDict: "amb@medic@standing@tendtodead@idle_a",
                    animName: "idle_a",
                    duration: 8000,
                    loop: false
                }
            ],
            vehicle: [
                {
                    label: "Verrouiller / Déverrouiller",
                    action: {
                        type: 'client',
                        event: 'vehicle:client:toggleLock',
                        args: null
                    },
                    icon: "FaLock",
                    permission: { job: "mechanic" },
                    role: "user",
                    animDict: "anim@mp_player_intmenu@key_fob@",
                    animName: "fob_click",
                    duration: 1000,
                    loop: false
                }
            ],
            object: [
                {
                    label: "S'asseoir",
                    action: {
                        type: 'client',
                        event: 'object:client:sitOnBench',
                        args: null
                    },
                    props: ["prop_bench_01", "prop_bench_02", "prop_bench_03"],
                    icon: "FaChair",
                    permission: null,
                    role: "user",
                    animDict: "anim@heists@fleeca_bank@ig_7_jetski_owner",
                    animName: "owner_idle",
                    duration: 5000,
                    loop: true
                }
            ],
            myself: [
                {
                    label: "Enlever / Mettre le Bonnet",
                    action: {
                        type: 'client',
                        event: 'clothes:client:handleClothingComponent',
                        args: 'hats'
                    },
                    icon: "FaHatCowboy",
                    permission: null,
                    role: "user",
                    animDict: "mp_masks@on_foot",
                    animName: "put_on_mask",
                    duration: 800,
                    loop: false
                },
                {
                    label: "Enlever / Mettre le Masque",
                    action: {
                        type: 'client',
                        event: 'clothes:client:handleClothingComponent',
                        args: 'mask'
                    },
                    icon: "FaTheaterMasks",
                    permission: null,
                    role: "user",
                    animDict: "mp_masks@on_foot",
                    animName: "put_on_mask",
                    duration: 800,
                    loop: false
                },
                {
                    label: "Enlever / Mettre les Lunettes",
                    action: {
                        type: 'client',
                        event: 'clothes:client:handleClothingComponent',
                        args: 'glasses'
                    },
                    icon: "FaGlasses",
                    permission: null,
                    role: "user",
                    animDict: "clothingspecs",
                    animName: "try_glasses_positive_a",
                    duration: 800,
                    loop: false
                },
                {
                    label: "Enlever / Mettre les Boucles d'oreilles",
                    action: {
                        type: 'client',
                        event: 'clothes:client:handleClothingComponent',
                        args: 'ears'
                    },
                    icon: "GiCrystalEarrings",
                    permission: null,
                    role: "user",
                    animDict: "mini@ears_defenders",
                    animName: "takeoff_earsdefenders_idle",
                    duration: 800,
                    loop: false
                },
                {
                    label: "Enlever / Mettre la Montre",
                    action: {
                        type: 'client',
                        event: 'clothes:client:handleClothingComponent',
                        args: 'watches'
                    },
                    icon: "FaStopwatch",
                    permission: null,
                    role: "user",
                    animDict: "nmt_3_rcm-10",
                    animName: "cs_nigel_dual-10",
                    duration: 800,
                    loop: false
                },
                {
                    label: "Enlever / Mettre le Bracelet",
                    action: {
                        type: 'client',
                        event: 'clothes:client:handleClothingComponent',
                        args: 'bracelets'
                    },
                    icon: "FaLifeRing",
                    permission: null,
                    role: "user",
                    animDict: "clothingtie",
                    animName: "try_tie_positive_a",
                    duration: 800,
                    loop: false
                },
                {
                    label: "Enlever / Mettre le Haut",
                    action: {
                        type: 'client',
                        event: 'clothes:client:handleClothingComponent',
                        args: 'tops'
                    },
                    icon: "FaTshirt",
                    permission: null,
                    role: "user",
                    animDict: "clothingshirt",
                    animName: "try_shirt_positive_d",
                    duration: 800,
                    loop: false
                },
                {
                    label: "Enlever / Mettre le Torse",
                    action: {
                        type: 'client',
                        event: 'clothes:client:handleClothingComponent',
                        args: 'torso'
                    },
                    icon: "FaTshirt",
                    permission: null,
                    role: "user",
                    animDict: "clothingtie",
                    animName: "try_tie_positive_a",
                    duration: 800,
                    loop: false
                },
                {
                    label: "Enlever / Mettre le Sous-vêtement",
                    action: {
                        type: 'client',
                        event: 'clothes:client:handleClothingComponent',
                        args: 'undershirt'
                    },
                    icon: "FaTshirt",
                    permission: null,
                    role: "user",
                    animDict: "clothingtie",
                    animName: "try_tie_negative_a",
                    duration: 800,
                    loop: false
                },
                {
                    label: "Enlever / Mettre le Gilet pare-balles",
                    action: {
                        type: 'client',
                        event: 'clothes:client:handleClothingComponent',
                        args: 'bodyArmor'
                    },
                    icon: "FaShieldAlt",
                    permission: null,
                    role: "user",
                    animDict: "clothingtie",
                    animName: "try_tie_positive_a",
                    duration: 800,
                    loop: false
                },
                {
                    label: "Enlever / Mettre le Sac",
                    action: {
                        type: 'client',
                        event: 'clothes:client:handleClothingComponent',
                        args: 'bags'
                    },
                    icon: "FaShoppingBag",
                    permission: null,
                    role: "user",
                    animDict: "anim@heists@ornate_bank@grab_cash_heels",
                    animName: "grab",
                    duration: 800,
                    loop: false
                },
                {
                    label: "Enlever / Mettre le Pantalon",
                    action: {
                        type: 'client',
                        event: 'clothes:client:handleClothingComponent',
                        args: 'legs'
                    },
                    icon: "PiPants",
                    permission: null,
                    role: "user",
                    animDict: "re@construction",
                    animName: "out_of_breath",
                    duration: 800,
                    loop: false
                },
                {
                    label: "Enlever / Mettre les Chaussures",
                    action: {
                        type: 'client',
                        event: 'clothes:client:handleClothingComponent',
                        args: 'shoes'
                    },
                    icon: "FaShoePrints",
                    permission: null,
                    role: "user",
                    animDict: "random@domestic",
                    animName: "pickup_low",
                    duration: 800,
                    loop: false
                },
                {
                    label: "Enlever / Mettre les Gants",
                    action: {
                        type: 'client',
                        event: 'clothes:client:handleClothingComponent',
                        args: 'accessories'
                    },
                    icon: "FaHandPaper",
                    permission: null,
                    role: "user",
                    animDict: "anim@mp_player_intcelebrationmale@thumbs_up",
                    animName: "thumbs_up",
                    duration: 800,
                    loop: false
                },
                {
                    label: "Enlever / Mettre les Cheveux",
                    action: {
                        type: 'client',
                        event: 'clothes:client:handleClothingComponent',
                        args: 'hair'
                    },
                    icon: "FaUser",
                    permission: null,
                    role: "user",
                    animDict: "clothingtie",
                    animName: "check_out_a",
                    duration: 800,
                    loop: false
                }
            ]
        }
    }
};
