global.config = {
    targetMenu : {
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
                    label: "Échanger",
                    action: "interact:trade",
                    function: "tradeWithPlayer",
                    icon: "FaHandshake",
                    permission: { job: "police", rank: "officer" },
                    role: "user"
                },
                {
                    label: "Soigner",
                    action: "interact:heal",
                    function: "healPlayer",
                    icon: "FaMedkit",
                    permission: { job: "medic" },
                    role: "user",
                }
            ],
            vehicle: [
                {
                    label: "Entrer",
                    action: "interact:enter",
                    function: "enterVehicle",
                    icon: "FaCar",
                    permission: null,
                    role: "user"
                },
                {
                    label: "Verrouiller",
                    action: "interact:lock",
                    function: "lockVehicle",
                    icon: "FaLock",
                    permission: { job: "mechanic" },
                    role: "user"
                },
                {
                    label: "Réparer",
                    action: "interact:repair",
                    function: "repairVehicle",
                    icon: "FaWrench",
                    permission: { job: "mechanic" },
                    role: "user",
                }
            ],
            object: [
                {
                    label: "Examiner",
                    action: "interact:examine",
                    function: "examineObject",
                    icon: "FaSearch",
                    permission: null,
                    role: "user",
                },
                {
                    label: "Utiliser",
                    action: "interact:use",
                    function: "useObject",
                    icon: "FaHandPointer",
                    permission: null,
                    role: "user",
                }
            ],
            myself: [
                {
                    label: "Inventaire",
                    action: "myself:inventory",
                    function: "openInventory",
                    icon: "FaBox",
                    permission: null,
                    role: "user",
                },
            ]
        }
    }
}
