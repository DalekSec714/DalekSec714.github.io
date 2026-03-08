//vimto.js mod for sandboxels by nota
//adds vimto from arabian stores
const vimto_version = "3.1.0";
dependOn("aChefsDream.js");
dependOn("aChefsDream2.js");
behaviors.VLIQUID = [
	"XX|XX|XX",
	"XX|XX|M2 AND BO",
	"XX|M1|M2"
];
elements.vimto = {
	color: "#2b1910",
	behavior: behaviors.VLIQUID,
	category: "food",
	state: "liquid",
	density: 1060,
	viscosity: 0,
	tempHigh: 103,
	stateHigh: ["steam", "steam", "sugar", "sodium_benzoate"],
	tempLow: 3,
	stateLow: "vimto_ice",
	conduct: 0.02,
	extinguish: true,
	flippableX: true,
	desc: "The vimto you get when you mix Vimto Cordial with Water.",
};
elements.sugarfree_vimto = {
	color: "#2b1910",
	behavior: behaviors.VLIQUID,
	category: "food",
	state: "liquid",
	density: 1060,
	viscosity: 0,
	tempHigh: 103,
	stateHigh: ["steam", "steam", "sodium_benzoate"],
	tempLow: 3,
	stateLow: "sugarfree_vimto_ice",
	conduct: 0.02,
	extinguish: true,
	flippableX: true,
	desc: "The vimto you get when you mix Sugarfree Vimto Cordial with Water.",
};
elements.sugarfree_vimto_ice = {
	color: "#e8a5b7",
	behavior: behaviors.WALL,
	category: "food",
	state: "solid",
	density: 1060,
	temp: -15,
	tempHigh: 3,
	stateHigh: "sugarfree_vimto",
	flippableX: true,
	desc: "A frozen version of sugarfree vimto, perfect for popping into your vimto drink",
};
elements.vimto_ice = {
	color: "#e8a5b7",
	behavior: behaviors.WALL,
	category: "food",
	state: "solid",
	density: 1060,
	temp: -15,
	tempHigh: 3,
	stateHigh: "vimto",
	flippableX: true,
	desc: "A frozen version of vimto, perfect for popping into your vimto drink",
};
elements.vimto_cordial = {
	color: "#2e020a",
	behavior: behaviors.VLIQUID,
	category: "food",
	reactions: {
		water: { elem1: null, elem2: "vimto" },
	},
	state: "liquid",
	density: 1420,
	viscosity: 5,
	tempHigh: 103,
	stateHigh: ["steam", "steam", "sugar", "sodium_benzoate"],
	tempLow: 3,
	stateLow: "vimto_cordial_ice",
	conduct: 0.02,
	extinguish: true,
	flippableX: true,
	desc: "The vimto you can buy from arabian stores as a cordial. Turns into normal Vimto when mixed with Water.",
};
elements.vimto_cordial_ice = {
	color: "#630617",
	behavior: behaviors.WALL,
	category: "food",
	state: "solid",
	density: 1430,
	temp: -15,
	tempHigh: 3,
	stateHigh: "vimto_cordial",
	flippableX: true,
	desc: "Vimto Cordial in solid form. Not reccomended for consumption.",
};
elements.sugarfree_vimto_cordial = {
	color: "#3d0422",
	behavior: behaviors.VLIQUID,
	category: "food",
	reactions: {
		sugar: { elem1: null, elem2: "vimto_cordial" },
		water: { elem1: null, elem2: "sugarfree_vimto" },
	},
	state: "liquid",
	density: 1400,
	flippableX: true,
	tempHigh: 85,
	stateHigh: ["steam", "steam", "sodium_benzoate"],
	tempLow: 3,
	stateLow: "sugarfree_vimto_cordial_ice",
	conduct: 0.02,
	extinguish: true,
	desc: "a sugar-free version of Vimto Cordial.",
};
elements.sugarfree_vimto_cordial_ice = {
	color: "#3d0422",
	behavior: behaviors.WALL,
	category: "food",
	reactions: {
		sugar: { elem1: null, elem2: "vimto_cordial_ice" },
	},
	state: "solid",
	density: 1410,
	flippableX: true,
	tempHigh: 3,
	stateHigh: "sugarfree_vimto_cordial",
	desc: "Sugar Free vimto Cordial in solid form. Not reccomended for consuption.",
};
elements.blackcurrant = {
	color: "#2b1910",
	behavior: behaviors.POWDER,
	category: "food",
	state: "solid",
	density: 1154,
	breakInto: "smashed_blackcurrant",
	tempHigh: 65,
	stateHigh: "raisin",
	desc: "A fruit, looks similar to grapes.",
};
elements.raspberry = {
	color: "#e30b5d",
	behavior: behaviors.POWDER,
	category: "food",
	state: "solid",
	density: 1054,
	breakInto: "smashed_raspberry",
	tempHigh: 65,
	stateHigh: "raisin",
	desc: "A sweet and tasty fruit.",
};
elements.smashed_blackcurrant = {
	color: "#2b1910",
	behavior: behaviors.VLIQUID,
	reactions: {
		smashed_raspberry: {
			elem1: null,
			elem2: "blackcurrant_raspberry_juice",
		},
	},
	category: "food",
	state: "liquid",
	density: 1154,
	flippableX: true,
	stateHigh: ["steam", "steam", "sugar", "smoke"],
	tempHigh: 98,
	conduct: 0.02,
	extinguish: true,
};
elements.smashed_raspberry = {
	color: "#e30b5d",
	behavior: behaviors.VLIQUID,
	reactions: {
		smashed_blackcurrant: {
			elem1: null,
			elem2: "blackcurrant_raspberry_juice",
		},
	},
	category: "food",
	state: "liquid",
	density: 1054,
	flippableX: true,
	stateHigh: ["steam", "steam", "sugar", "smoke"],
	tempHigh: 98,
	conduct: 0.02,
	extinguish: true,
};
elements.blackcurrant_raspberry_juice = {
	color: "#1e0321",
	behavior: behaviors.VLIQUID,
	category: "food",
	reactions: {
		grape_juice: {
			elem1: null,
			elem2: "blackcurrant_raspberry_grape_juice",
		},
	},
	state: "liquid",
	density: 2208,
	flippableX: true,
	conduct: 0.02,
	stain: 0.5,
	extinguish: true,
};
elements.blackcurrant_raspberry_grape_juice = {
	color: "#3d042f",
	behavior: behaviors.VLIQUID,
	category: "food",
	reactions: {
		sodium_benzoate: { elem1: null, elem2: "sugarfree_vimto_cordial" },
	},
	state: "liquid",
	density: 2208,
	flippableX: true,
	conduct: 0.02,
	stain: 0.5,
	extinguish: true,
};
elements.sodium_benzoate = {
	color: "#ffffff",
	behavior: behaviors.POWDER,
	category: "powders",
	reactions: {
		blackcurrant_raspberry_grape_juice: {
			elem1: null,
			elem2: "sugarfree_vimto_cordial",
		},
	},
	tempHigh: 436,
	stateHigh: "molten_sodium_benzoate",
	state: "solid",
	density: 1497,
};
elements.molten_sodium_benzoate = {
	color: ["#ff6f00", "#ff8c00", "#ff4d00"],
	behavior: behaviors.MOLTEN,
	renderer: renderPresets.MOLTEN,
	category: "states",
	reactions: {
		ice: { elem1: "sodium_benzoate", elem2: null },
	},
	temp: 456,
	tempLow: 436,
	stateLow: "sodium_benzoate",
	tempHigh: 475,
	stateHigh: "explosion",
	state: "liquid",
	density: 1497,
};
console.log("vimto.js successfully loaded");
console.log("vimto.js is running version " + version);
