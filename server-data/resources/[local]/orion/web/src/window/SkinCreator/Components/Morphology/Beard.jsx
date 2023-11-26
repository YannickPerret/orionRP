import React from 'react'

export default function Beard() {
  return (
    <div class="group">
        <h2>Beard</h2>
        <div class="input">
        <div class="label">Beard type</div>
        <div class="label-value" data-legend="/28"></div>
        <div class="type-range">
            <a href="#" class="arrow arrow-left">&nbsp;</a>
            <input value="0" type="range" class="barbe" min="0" max="28" />
            <a href="#" class="arrow arrow-right">&nbsp;</a>
        </div>
        </div>

        <div class="input">
        <div class="label">Beard thickness</div>
        <div class="label-value" data-legend="/10"></div>
        <div class="type-range">
            <a href="#" class="arrow arrow-left">&nbsp;</a>
            <input value="0" type="range" class="epaisseurbarbe" min="0" max="10" />
            <a href="#" class="arrow arrow-right">&nbsp;</a>
        </div>
        </div>

        <div class="input">
        <div class="label">Beard Color</div>
        <div class="type-radio">
            <label for="bc1">
            <input type="radio" name="barbecolor" class="barbecolor" value="0" id="bc1" checked />
            <span class="color" data-color="#1D1D1A"></span>
            </label>
            <label for="bc2">
            <input type="radio" name="barbecolor" class="barbecolor" value="2" id="bc2"/>
            <span class="color" data-color="#4B392D"></span>
            </label>
            <label for="bc3">
            <input type="radio" name="barbecolor" class="barbecolor" value="4" id="bc3" />
            <span class="color" data-color="#7A3B1F"></span>
            </label>
            <label for="bc4">
            <input type="radio" name="barbecolor" class="barbecolor" value="6" id="bc4" />
            <span class="color" data-color="#A35631"></span>
            </label>
            <label for="bc5">
            <input type="radio" name="barbecolor" class="barbecolor" value="8" id="bc5" />
            <span class="color" data-color="#A96F49"></span>
            </label>
            <label for="bc6">
            <input type="radio" name="barbecolor" class="barbecolor" value="10" id="bc6" />
            <span class="color" data-color="#BD8D5E"></span>
            </label>
            <label for="bc7">
            <input type="radio" name="barbecolor" class="barbecolor" value="12" id="bc7" />
            <span class="color" data-color="#CBA66F"></span>
            </label>
            <label for="bc8">
            <input type="radio" name="barbecolor" class="barbecolor" value="14" id="bc8" />
            <span class="color" data-color="#E8BE78"></span>
            </label>
            <label for="bc9">
            <input type="radio" name="barbecolor" class="barbecolor" value="16" id="bc9" />
            <span class="color" data-color="#D09E6A"></span>
            </label>
            <label for="bc13">
            <input type="radio" name="barbecolor" class="barbecolor" value="24" id="bc13" />
            <span class="color" data-color="#C85831"></span>
            </label>
            <label for="bc14">
            <input type="radio" name="barbecolor" class="barbecolor" value="26" id="bc14" />
            <span class="color" data-color="#947A67"></span>
            </label>
            <label for="bc15">
            <input type="radio" name="barbecolor" class="barbecolor" value="28" id="bc15" />
            <span class="color" data-color="#D8C1AC"></span>
            </label>
        </div>
        </div>
    </div>

  )
}
