import React from 'react'

export default function Eyes() {
  return (
    <div class="group">
        <h2>Eyebrows</h2>
        <div class="input">
            <div class="label">Eyebrow type</div>
            <div class="label-value" data-legend="/34"></div>
            <div class="type-range">
                <a href="#" class="arrow arrow-left">&nbsp;</a>
                <input value="0" type="range" class="sourcils" min="0" max="34" />
                <a href="#" class="arrow arrow-right">&nbsp;</a>
            </div>
            <div class="input">
                <div class="label">Eyebrows thickness</div>
                <div class="label-value" data-legend="/10"></div>
                <div class="type-range">
                <a href="#" class="arrow arrow-left">&nbsp;</a>
                <input value="10" type="range" class="epaisseursourcils" min="0" max="10" />
                <a href="#" class="arrow arrow-right">&nbsp;</a>
                </div>
            </div>
        </div>

        <div class="input">
          <div class="label">Eye color</div>
          <div class="type-radio">
            <label for="eye1">
              <input type="radio" name="eyecolor" class="eyecolor" value="0" id="eye1" checked />
              <span class="color" data-color="#525e37"></span>
            </label>
            <label for="eye2">
              <input type="radio" name="eyecolor" class="eyecolor" value="1" id="eye2" />
              <span class="color" data-color="#263419"></span>
            </label>
            <label for="eye3">
              <input type="radio" name="eyecolor" class="eyecolor" value="2" id="eye3" />
              <span class="color" data-color="#83b7d5"></span>
            </label>
            <label for="eye4">
              <input type="radio" name="eyecolor" class="eyecolor" value="3" id="eye4" />
              <span class="color" data-color="#3e66a3"></span>
            </label>
            <label for="eye5">
              <input type="radio" name="eyecolor" class="eyecolor" value="4" id="eye5" />
              <span class="color" data-color="#8d6833"></span>
            </label>
            <label for="eye6">
              <input type="radio" name="eyecolor" class="eyecolor" value="5" id="eye6" />
              <span class="color" data-color="#523711"></span>
            </label>
            <label for="eye7">
              <input type="radio" name="eyecolor" class="eyecolor" value="6" id="eye7" />
              <span class="color" data-color="#d08418"></span>
            </label>
            <label for="eye9">
              <input type="radio" name="eyecolor" class="eyecolor" value="8" id="eye9" />
              <span class="color" data-color="#bebebe"></span>
            </label>
            <label for="eye13">
              <input type="radio" name="eyecolor" class="eyecolor" value="12" id="eye13" />
              <span class="color" data-color="#0d0d0c"></span>
            </label>
          </div>
        </div>
    </div>
  )
}
