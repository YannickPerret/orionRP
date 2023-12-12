let UnzoomSkyCam = null;
let ZoomSkyCam = null;

const StartUnzoomSkyCam = async () => {
  SetCloudHatOpacity(0.0);
  SetWeatherTypePersist('CLEAR');
  SetWeatherTypeNowPersist('CLEAR');
  SetWeatherTypeNow('CLEAR');
  SetOverrideWeather('CLEAR');
  UnzoomSkyCam = CreateCamWithParams(
    'DEFAULT_SCRIPTED_CAMERA',
    -421.0049,
    1155.414,
    324.8574 + 500,
    -85.0,
    0.0,
    260.0,
    100.0,
    false,
    0
  );
  SetCamActive(UnzoomSkyCam, true);
  SetFocusArea(-421.0049, 1155.414, 324.8574 + 10, 50, 0.0, 0.0);
  ShakeCam(UnzoomSkyCam, 'HAND_SHAKE', 0.15);
  SetEntityVisible(PlayerPedId(), false);
  RenderScriptCams(true, false, 3000, 1, 1);

  SetFocusArea(-265.51, -811.01, 31.85 + 175, 0.0, 0.0, 0.0);
  SetCamParams(UnzoomSkyCam, -400.0, 1700.0, 31.85 + 3000, -85.0, 0.0, 260.0, 100.0, 4500, 0, 0, 2);
  SetEntityCoords(PlayerPedId(), -421.0049, 1155.414, 324.8574 - 0.9, 0, 0, 0, false);
  SetEntityHeading(PlayerPedId(), 80);
  FreezeEntityPosition(PlayerPedId(), true);
  await exports['orion'].delay(4500);
};

const StopUnzoomSkyCam = () => {
  if (DoesCamExist(UnzoomSkyCam)) {
    RenderScriptCams(false, true, 500, true, true);
    SetCamActive(UnzoomSkyCam, false);
    DestroyCam(UnzoomSkyCam, true);
    ClearFocus();

    UnzoomSkyCam = null;
  }
};

const StartZoomSkyCam = () => {
  ZoomSkyCam = CreateCamWithParams(
    'DEFAULT_SCRIPTED_CAMERA',
    -400.0,
    1700.0,
    31.85 + 3000,
    -85.0,
    0.0,
    260.0,
    100.0,
    false,
    0
  );
  SetCamActive(ZoomSkyCam, true);
  SetFocusArea(-265.51, -811.01, 31.85 + 175, 0.0, 0.0, 0.0);
  ShakeCam(ZoomSkyCam, 'HAND_SHAKE', 0.15);
  SetEntityVisible(PlayerPedId(), false);
  RenderScriptCams(true, false, 3000, 1, 1);
};

const StopZoomSkyCam = async () => {
  if (DoesCamExist(ZoomSkyCam)) {
    RenderScriptCams(false, true, 4500, true, true);
    let waiting = true;
    SetTick(() => {
      while (waiting) {
        DisableControlAction(0, 1, true);
        DisableControlAction(0, 2, true);
        await exports['orion'].delay(0);

      }
    });
    await exports['orion'].delay(4500);
    SetCamActive(ZoomSkyCam, false);
    DestroyCam(ZoomSkyCam, true);
    ClearFocus();

    waiting = false;
    ZoomSkyCam = null;
  }
};

const ClearScreen = () => {
  SetCloudHatOpacity(0.01);
  HideHudAndRadarThisFrame();
  ClearCloudHat();
  ClearOverrideWeather();
};
