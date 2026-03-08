elements.flying_saucer = {
    color: "#7a7769",
    behavior: behaviors.FLY,
    category: "extraterrestrials",
    state: "solid",
    behaviorOn: [
        "XX|CR:extraterrestrial|XX",
        "XX|XX|XX",
        "XX|CR:blaster%5|XX"
    ],
    reactions: {
        "explosion":{ elem1:["falling_saucer","explosion"], chance:0.005 }
    },
    breakInto: ["falling_saucer", "explosion"],
    burnInto: ["explosion","falling_saucer"],
    temp: 30,
    tempHigh: 9999,
    burn: 100,
    burnTime: 90,
    stateHigh: ["explosion","falling_saucer"],
    conduct: 1,
    noMix:true,
    hardness:1,
    extraInfo: "an infamous unidentified flying object, it is currently being piloted by intelligent lifeforms."
},
elements.falling_saucer = {
	color: ["#8a7d43","#ff4d00","#ff7700"],
	tick: function(pixel) {
		for (var i = 0; i < 3; i++) {
			var skip = false;
			if (!isEmpty(pixel.x,pixel.y+1,true)) {
				var p = pixelMap[pixel.x][pixel.y+1];
				if (p.element === "blaster") { skip = true; }
				if (Math.random() < 0.9 && elements[p.element].hardness !== 1) {
					deletePixel(p.x,p.y);
				}
			}
			if (!tryMove(pixel,pixel.x,pixel.y+1,["flash","smoke","electric"]) && !skip) {
				explodeAt(pixel.x,pixel.y,20,["plasma","steam","smoke"]);
				var coords = circleCoords(pixel.x,pixel.y,15);
				coords.forEach(function(coord){
					var x = coord.x;
					var y = coord.y;
					if (!isEmpty(x,y,true)) {
						if (!elements[pixelMap[x][y].element].insulate) { pixelMap[x][y].temp += 10000; }
						pixelTempCheck(pixelMap[x][y]);
					}
				})
				deletePixel(pixel.x,pixel.y);
				return;
			}
		}
	},
	category: "extraterrestrials",
	state: "solid",
	density: 100000000,
	temp: 10000,
	hardness: 1,
	maxSize: 3,
	cooldown: defaultCooldown,
	excludeRandom: true,
	glow: true,
    hidden: true
},
elements.extraterrestrial = {
    color: "#4e6653",
    behavior: [
        "SW:body%5 AND M2%1.5 AND CR:l_laser_gun_beam%0.1|XX|SW:body%5 AND M2%5 AND CR:laser_gun_beam%0.1",
        "M2%9|FX%5|M2%9",
        "XX|M1|M2"
    ],
    reactions: {
        "head": { elem2:["blood","meat","bone"], chance:0.5, func:behaviors.FEEDPIXEL },
        "blood": { elem2:null, chance:0.5, func:behaviors.FEEDPIXEL },
        "meat":{ elem2:null, chance:0.01, func:behaviors.FEEDPIXEL },
        "cooked_meat": { elem2:null, chance:0.04, func:behaviors.FEEDPIXEL },
        "radiation": { elem1:"poison", elem2:null },
        "body":{ attr2:{"panic":20} },
        "rotten_meat": { elem2:null, chance:0.005, func:behaviors.FEEDPIXEL }
    },
    tempHigh: 200,
    stateHigh: "poison",
    tempLow: -100,
    stateLow: "frozen_lifeform",
    category: "extraterrestrials",
    state: "solid",
    density: 1450,
    hidden: true,
    breakInto: ["infection","poison","slime"],
    burnInto: "poison",
    foodNeed: 4,
    maxSize: 1,
    egg: "mysterious_egg",
    eggColor: "#384d38ee",
    baby: "extraterrestrial",
    extraInfo: "this lifeform may be very small, but it's intellegence allows them to conquer the planet with powerful weapons. it's not afraid to use them."
},
elements.frozen_lifeform = {
    color: ["#80a0a6","#86b9b1","#789497","#78b696"],
    behavior: behaviors.STICKY,
    temp: -10,
    tempHigh: 5,
    stateHigh: "extraterrestrial",
    category: "extraterrestrials",
    state: "solid",
    density: 917,
    breakInto: ["infection","poison","slime","extraterrestrial"],
    hidden: true,
    extraInfo: "if this thing manages to defrost, may god help us all."
},
elements.laser_gun_beam = {
	color: ["#ff0000","#ff1e00","#ff3300"],
	tick: function(pixel) {
		for (var i = 0; i < 3; i++) {
			var skip = false;
			if (!isEmpty(pixel.x+1,pixel.y,true)) {
				var p = pixelMap[pixel.x+1][pixel.y];
				if (p.element === "blaster") { skip = true; }
				if (Math.random() < 0.9 && elements[p.element].hardness !== 1) {
					deletePixel(p.x,p.y);
				}
			}
			if (!tryMove(pixel,pixel.x+1,pixel.y,["steam","smoke","electric"]) && !skip) {
				explodeAt(pixel.x,20,pixel.y,["plasma","fire","flash"]);
				var coords = circleCoords(pixel.x,15,pixel.y,);
				coords.forEach(function(coord){
					var x = coord.x;
					var y = coord.y;
					if (!isEmpty(x,y,true)) {
						if (!elements[pixelMap[x][y].element].insulate) { pixelMap[x][y].temp += 10000; }
						pixelTempCheck(pixelMap[x][y]);
					}
				})
				deletePixel(pixel.x,pixel.y);
				return;
			}
		}
	},
	category: "extraterrestrials",
	state: "solid",
	density: 100000000,
	temp: 10000,
	hardness: 1,
	maxSize: 3,
	cooldown: defaultCooldown,
	excludeRandom: true,
	glow: true,
    hidden:true,
    extraInfo: "a powerful heat seeking laser beam that causes devastating amounts of damage."
},
elements.l_laser_gun_beam = {
	color: ["#ff0000","#ff1e00","#ff3300"],
	tick: function(pixel) {
		for (var i = 0; i < 3; i++) {
			var skip = false;
			if (!isEmpty(pixel.x-1,pixel.y,true)) {
				var p = pixelMap[pixel.x-1][pixel.y];
				if (p.element === "blaster") { skip = true; }
				if (Math.random() < 0.9 && elements[p.element].hardness !== 1) {
					deletePixel(p.x,p.y);
				}
			}
			if (!tryMove(pixel,pixel.x-1,pixel.y,["steam","smoke","electric"]) && !skip) {
				explodeAt(pixel.x,20,pixel.y,["plasma","fire","flash"]);
				var coords = circleCoords(pixel.x,-15,pixel.y,);
				coords.forEach(function(coord){
					var x = coord.x;
					var y = coord.y;
					if (!isEmpty(x,y,true)) {
						if (!elements[pixelMap[x][y].element].insulate) { pixelMap[x][y].temp += 10000; }
						pixelTempCheck(pixelMap[x][y]);
					}
				})
				deletePixel(pixel.x,pixel.y);
				return;
			}
		}
	},
	category: "extraterrestrials",
	state: "solid",
	density: 100000000,
	temp: 10000,
	hardness: 1,
	maxSize: 3,
	cooldown: defaultCooldown,
	excludeRandom: true,
	glow: true,
    hidden: true
}
elements.mysterious_egg = {
	color: "#1a271c",
	tick: function(pixel) {
		if (pixel.start === pixelTicks) {return}
		if (pixel.drag) pixel.fall = 0;
		if (!tryMove(pixel, pixel.x, pixel.y+1)) {
			if (pixel.animal || pixel.fall < 20) {
				if (Math.random() < 0.5) {
					if (!tryMove(pixel, pixel.x+1, pixel.y+1)) {
						tryMove(pixel, pixel.x-1, pixel.y+1);
					}
				} else {
					if (!tryMove(pixel, pixel.x-1, pixel.y+1)) {
						tryMove(pixel, pixel.x+1, pixel.y+1);
					}
				}
				pixel.fall = 0;
			}
			else if (outOfBounds(pixel.x,pixel.y+1) || (!isEmpty(pixel.x,pixel.y+1,true) && elements.egg.ignore.indexOf(pixelMap[pixel.x][pixel.y+1].element) === -1 && elements[pixelMap[pixel.x][pixel.y+1].element].state === "solid")) {
				changePixel(pixel,"poison")
			}
			else {pixel.fall = 0}
			if (pixel.animal && pixelTicks-pixel.start >= 500 && Math.random() < 0.2) {
				changePixel(pixel,pixel.animal)
			}
		}
		else {pixel.fall ++}
		if (pixel.temp < -2 || pixel.temp > 100) {
			pixel.animal = null;
		}
		doDefaults(pixel);
	},
	ignore: ["paper","sponge","straw","wheat","rat","frog","pollen","clay","snow","mud","wet_sand","tinder","feather","bread","ice_cream","dough","body","head"],
	innerColor: "#27572e",
	properties: { "fall":0 },
	tempHigh: 1500,
	stateHigh: ["steam","poison_gas","carbon_dioxide","acid_gas"],
	breakInto: ["poison","acid"],
	category: "extraterrestrials",
	state: "solid",
	density: 1031,
	cooldown: defaultCooldown,
    hidden:true,
    extraInfo: "the end result of the extraterrestrials managing to reproduce, do not let it hatch."
},
elements.intergalatic_portal = {
    color:"#869b78",
    behavior: [
        "CR:portal_closer%1|CR:flying_saucer%0.2 AND CR:portal_closer%1|CR:portal_closer%1",
        "CR:flying_saucer%0.2|XX|CR:flying_saucer%0.2",
        "XX|CR:flying_saucer%0.2|XX"
    ],
    renderer: renderPresets.BORDER,
    grain:0,
    category: "extraterrestrials",
    insulate:true,
    moveable:false,
    conduct:1,
    emit:true,
    glow:true,
    extraInfo: "a mysterious gateway that'll cause the beginning of the invasion."
}
elements.portal_closer = {
    color:"#ffffff",
    behavior: [
        "XX|XX|XX",
        "XX|DL%50|XX",
        "DL|DL AND M1|DL"
    ],
    grain:0,
    category:"extraterrestrials",
    insulate:true,
    moveable:false,
    emit:true,
    glow:true,
    hidden:true
}