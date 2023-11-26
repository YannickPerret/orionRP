import React from 'react'

export default function SkinTone() {
  return (
    <div class="group">
    <div class="input">
      <div class="label">Skin tone</div>
      <div class="type-radio">
        <label for="p1">
          <input type="radio" name="peaucolor" class="peaucolor" value="12" id="p1" checked />
          <span class="color" data-color="#ecc8ae"></span>
        </label>
        <label for="p2">
          <input type="radio" name="peaucolor" class="peaucolor" value="25" id="p2" />
          <span class="color" data-color="#ce9874"></span>
        </label>
        <label for="p3">
          <input type="radio" name="peaucolor" class="peaucolor" value="19" id="p3" />
          <span class="color" data-color="#925a41"></span>
        </label>
        <label for="p4">
          <input type="radio" name="peaucolor" class="peaucolor" value="14" id="p4" />
          <span class="color" data-color="#4e3a26"></span>
        </label>
      </div>
    </div>

    <div class="input">
      <div class="label">Acne</div>
      <div class="label-value" data-legend="/23"></div>
      <div class="type-range">
        <a href="#" class="arrow arrow-left">&nbsp;</a>
        <input value="0" type="range" class="acne" min="0" max="23" />
        <a href="#" class="arrow arrow-right">&nbsp;</a>
      </div>
    </div>

    <div class="input">
      <div class="label">Skin problems</div>
      <div class="label-value" data-legend="/11"></div>
      <div class="type-range">
        <a href="#" class="arrow arrow-left">&nbsp;</a>
        <input value="0" type="range" class="pbpeau" min="0" max="11" />
        <a href="#" class="arrow arrow-right">&nbsp;</a>
      </div>
    </div>

    <div class="input">
      <div class="label">Cruel</div>
      <div class="label-value" data-legend="/17"></div>
      <div class="type-range">
        <a href="#" class="arrow arrow-left">&nbsp;</a>
        <input value="0" type="range" class="tachesrousseur" min="0" max="17" />
        <a href="#" class="arrow arrow-right">&nbsp;</a>
      </div>
    </div>

    <div class="input">
      <div class="label">Wrinkles</div>
      <div class="label-value" data-legend="/14"></div>
      <div class="type-range">
        <a href="#" class="arrow arrow-left">&nbsp;</a>
        <input value="0" type="range" class="rides" min="0" max="14" />
        <a href="#" class="arrow arrow-right">&nbsp;</a>
      </div>
    </div>

    <div class="input">
      <div class="label">Wrinkles intensity</div>
      <div class="label-value" data-legend="/10"></div>
      <div class="type-range">
        <a href="#" class="arrow arrow-left">&nbsp;</a>
        <input value="10" type="range" class="intensiterides" min="0" max="10" />
        <a href="#" class="arrow arrow-right">&nbsp;</a>
      </div>
    </div>
  </div>
  )
}
