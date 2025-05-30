Config = {}

Config.AllowCommand = true
Config.MaxPowerKick = 3.0
Config.MaxPowerThrow = 3.0
Config.MaxPowerUnder = 3.0

Config.TackleKey = 49

Config.PickupControl = 38
Config.DropControl = 47
Config.DeleteControl = 48

Config.TackleEnabled = true

Config.ThrowControl = 38
Config.UnderControl = 48
Config.KickControl = 44


Config.Red = 0
Config.Green = 0
Config.Blue = 255


--locales
Config.BallDeleted = 'Ball Deleted.'
Config.PowerLocale = 'Power'


function NotifyDelete()
    exports['mythic_notify']:SendAlert('error', Config.BallDeleted) -- 'Ball Deleted.'
end