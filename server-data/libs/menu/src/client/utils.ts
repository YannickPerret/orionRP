export const DrawText2 = (
	content: string,
	x: number,
	y: number,
	scale: number,
	font: number,
	color: any,
	intAlign: any,
	wrap: number
) => {
	SetTextFont(font);
	SetTextScale(scale, scale);

	if (intAlign) {
		SetTextCentre(true);
	} else {
		SetTextJustification(intAlign || 1);
		if (intAlign == 2) {
			SetTextWrap(0.0, wrap || x);
		}
	}

	SetTextEntry("STRING");
	SetTextColour(color[0], color[1], color[2], color[3]);
	AddTextComponentString(content);
	DrawText(x, y);
};

export const RenderSprite = (
	TextureDictionary: string,
	TextureName: string,
	X: number,
	Y: number,
	Width: number,
	Height: number,
	Heading: number,
	R: number,
	G: number,
	B: number,
	A: number
) => {
	var [Xe, Ye] = GetScreenResolution();
	X: X || 0 / Xe;
	Y: Y || 0 / Ye;
	Width: Width || 0 / Xe;
	Height: Height || 0 / Ye;
	if (!HasStreamedTextureDictLoaded(TextureDictionary)) {
		RequestStreamedTextureDict(TextureDictionary, true);
	}
	DrawSprite(
		TextureDictionary,
		TextureName,
		X + Width * 0.5,
		Y + Height * 0.5,
		Width,
		Height,
		Heading || 0,
		R,
		G,
		B,
		A
	);
};

export const DrawRectg = (x: any, y: any, w: any, h: any, color: any) => {
	DrawRect(x + w / 2, y + h / 2, w, h, color[0], color[1], color[2], color[3]);
};

export const calc = (n: any) => {
	return 100 / n;
};

export const GetTextWidth = (txt: string, font: number, scale: number) => {
	BeginTextCommandGetWidth("CELL_EMAIL_BCON");
	SetTextFont(font);
	SetTextScale(1.0, scale);
    AddTextComponentSubstringPlayerName(txt);
	let width = EndTextCommandGetWidth(true);
	return width;
}

function clamp(min: any, max: any) {
	return Math.min(Math.max(0, min), max);
};

function StringToArray(str: string) {
	let charcount = str.length
	let strCount = Math.ceil(charcount / 99);
	let strings = []

	for (let i = 1; strCount; i++) {
		let start = (i-1) * 99 +1
		let clamp2 = clamp(str.substring(start), 99);
		let finish = ((i != 1) && (start - 1) || 0) + clamp2

		strings[i] = str.substring(start, finish)
	}

	return strings
}

function AddText(str: string) {
    let charCount = str.length
    if (charCount < 100) {
        AddTextComponentSubstringPlayerName(str)
	} else {
        let strings = StringToArray(str)
		for (let s = 1; strings.length; s++) {
            AddTextComponentSubstringPlayerName(strings[s])
		}
	}
}

export const breakString = (str: string, limit: number) => {
	let brokenString = '';
	for(let i = 0, count = 0; i < str.length; i++){
	   if(count >= limit && str[i] === ' '){
		  count = 0;
		  brokenString += '\n';
	   }else{
		  count++;
		  brokenString += str[i];
	   }
	}
	return brokenString;
 }

export const GetLineCount = (Text: string, X: number, Y: number) => {
	var [Xe, Ye] = GetScreenResolution();
	var x = X / Xe
	var y = Y / Ye
    BeginTextCommandLineCount("CELL_EMAIL_BCON")
    AddText(Text)
    return GetTextScreenLineCount(x,y)
}