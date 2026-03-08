elements.yttrium = {
    color: ["#bfc7cf", "#aeb6bf", "#d0d7de"],
    state: "solid",
    category: "solids",
    behavior: behaviors.WALL,

    density: 4470,
    conduct: 0.6,
    hardness: 0.6,

    temp: 20,
    tempHigh: 1526,
    stateHigh: "molten_yttrium",
};

elements.molten_yttrium = {
    color: ["#ffb347", "#ff9933", "#ff7f24"],
    state: "liquid",
    category: "states",
    behavior: behaviors.LIQUID,

    density: 4300,
    conduct: 0.5,

    temp: 1600,
    tempLow: 1500,
    stateLow: "yttrium",
};

elements.yttrium_oxide = {
    color: "#f2f2f2",
    state: "solid",
    category: "solids",
    behavior: behaviors.WALL,

    density: 5010,
    hardness: 0.85,
    temp: 20
};

elements.yttrium_powder = {
    color: ["#d6dde4", "#c8d0d8"],
    state: "solid",
    category: "powders",
    behavior: behaviors.POWDER,

    density: 2500,
    conduct: 0.6,

    temp: 20,
    tempHigh: 1400,
    stateHigh: "molten_yttrium"
};

elements.yttrium.reactions = {
    "oxygen": {
        elem2: "yttrium_oxide",
        chance: .0005,
        tempMin: 400
    }
};

elements.molten_yttrium.reactions = {
    "oxygen": {
        elem2: "yttrium_oxide",
        chance: 0.02
    }
};

elements.yttrium_powder.reactions = {
    "oxygen": {
        elem2: "yttrium_oxide",
        chance: 0.01,
        tempMin: 100
    }
};

elements.yttrium_powder.reactions = {
    "water": {
    elem2: "yttrium_oxide",
    chance: 0.002
    }
};

elements.niobium = {
    color: ["#9ea7ad", "#8f989f", "#b3bcc2"],
    state: "solid",
    category: "solids",
    behavior: behaviors.WALL,

    density: 8570,
    hardness: 0.78,
    conduct: 0.65,

    temp: 20,

    tempHigh: 2477,
    stateHigh: "molten_niobium",

    tick(pixel) {
        if (pixel.temp < -263.8) {
            pixel.conduct = 1; 
        } else {
            pixel.conduct = 0.65;
        }

        if (pixel.temp > 600) {
            let neighbors = [
                pixelMap[pixel.x][pixel.y-1],
                pixelMap[pixel.x][pixel.y+1],
                pixelMap[pixel.x-1]?.[pixel.y],
                pixelMap[pixel.x+1]?.[pixel.y]
            ];

            for (let n of neighbors) {
                if (n && n.element === "oxygen") {
                    if (Math.random() < 0.002) {
                        pixel.element = "niobium_oxide";
                    }
                }
            }
        }
    }
};

elements.molten_niobium = {
    color: ["#ffcc66", "#ff9933", "#ff5500"],
    state: "liquid",
    category: "states",
    behavior: behaviors.LIQUID,

    density: 8200,
    conduct: 0.55,

    temp: 2600,

    tempLow: 2400,
    stateLow: "niobium",

    tick(pixel) {
        let neighbors = [
            pixelMap[pixel.x][pixel.y-1],
            pixelMap[pixel.x][pixel.y+1],
            pixelMap[pixel.x-1]?.[pixel.y],
            pixelMap[pixel.x+1]?.[pixel.y]
        ];

        for (let n of neighbors) {
            if (n && n.element === "oxygen") {
                if (Math.random() < 0.05) {
                    pixel.element = "niobium_oxide";
                }
            }
        }
    }
};

elements.niobium_oxide = {
    color: "#f2f2f2",
    state: "solid",
    category: "solids",
    behavior: behaviors.WALL,

    density: 4600,
    hardness: 0.92,

    conduct: 0.02,

    temp: 20
};

elements.niobium_powder = {
    color: ["#c5ccd1", "#b7bec4"],
    state: "solid",
    category: "powders",
    behavior: behaviors.POWDER,

    density: 5000,
    conduct: 0.65,

    temp: 20,
    tempHigh: 2300,
    stateHigh: "molten_niobium",

    tick(pixel) {
        let neighbors = [
            pixelMap[pixel.x][pixel.y-1],
            pixelMap[pixel.x][pixel.y+1],
            pixelMap[pixel.x-1]?.[pixel.y],
            pixelMap[pixel.x+1]?.[pixel.y]
        ];

        for (let n of neighbors) {
            if (n && n.element === "oxygen") {
                if (pixel.temp > 200 && Math.random() < 0.02) {
                    pixel.element = "niobium_oxide";
                }
            }
        }
    }
};

elements.hafnium = {
    color: ["#9a9fa3", "#8a8f93", "#b0b5b9"],
    state: "solid",
    category: "solids",
    behavior: behaviors.WALL,
    density: 13300,
    hardness: 0.85,
    conduct: 0.6,
    temp: 20,
    tempHigh: 2233,
    stateHigh: "molten_hafnium"
};

elements.molten_hafnium = {
    color: ["#ffb84d", "#ff9933", "#ff6600"],
    state: "liquid",
    category: "states",
    behavior: behaviors.LIQUID,
    density: 12800,
    conduct: 0.55,
    temp: 2400,
    tempLow: 2150,
    stateLow: "hafnium"
};

elements.hafnium_oxide = {
    color: "#f5f5f5",
    state: "solid",
    category: "solids",
    behavior: behaviors.WALL,
    density: 9700,
    hardness: 0.95,
    conduct: 0.02,
    temp: 20
};

elements.hafnium_powder = {
    color: ["#c1c6ca", "#b3b8bc"],
    state: "solid",
    category: "powders",
    behavior: behaviors.POWDER,
    density: 8000,
    conduct: 0.6,
    temp: 20,
    tempHigh: 2100,
    stateHigh: "molten_hafnium"
};

elements.hafnium_powder.reactions = {
    "oxygen": {
        elem1: "hafnium_oxide",
        chance: 0.01,
        tempMin: 300
    }
};

elements.molten_hafnium.reactions = {
    "oxygen": {
        elem1: "hafnium_oxide",
        chance: 0.04
    }
};

elements.hafnium.reactions = {
    "neutron": {
        elem1: "hafnium",
        elem2: null,
        temp1: 30,
        chance: 0.9
    }
};

elements.hafnium_oxide.reactions = {
    "neutron": {
        elem1: "hafnium_oxide",
        elem2: null,
        temp1: 20,
        chance: 0.8
    }
};

elements.hafnium_powder.reactions["neutron"] = {
    elem1: "hafnium_powder",
    elem2: null,
    temp1: 40,
    chance: 0.95
};

elements.cadmium = {
    color: ["#d0d0d0", "#c0c0c0", "#e0e0e0"],
    state: "solid",
    category: "solids",
    behavior: behaviors.WALL,
    density: 8650,
    hardness: 0.5,
    conduct: 0.4,
    temp: 20,
    tempHigh: 321,
    stateHigh: "molten_cadmium"
};

elements.molten_cadmium = {
    color: ["#ffebcc", "#ffd699", "#ffb84d"],
    state: "liquid",
    category: "states",
    behavior: behaviors.LIQUID,
    density: 7500,
    conduct: 0.35,
    temp: 350,
    tempLow: 310,
    stateLow: "cadmium"
};

elements.cadmium.reactions = {
    "neutron": { elem1: "cadmium", elem2: null, chance: 0.9, temp1: 20 }
};

elements.molten_cadmium.reactions = {
    "neutron": { elem1: "molten_cadmium", elem2: null, chance: 0.8, temp1: 300 }
};

elements.silver_indium_cadmium_alloy = {
    color: ["#e6e6e6", "#d9d9d9", "#cccccc"],
    state: "solid",
    category: "solids",
    behavior: behaviors.WALL,
    density: 10500,
    hardness: 0.6,
    conduct: 0.5,
    temp: 20,
    tempHigh: 300,
    stateHigh: "molten_silver_indium_cadmium"
};

elements.molten_silver_indium_cadmium = {
    color: ["#ffe6cc", "#ffd699", "#ffb84d"],
    state: "liquid",
    category: "states",
    behavior: behaviors.LIQUID,
    density: 9800,
    conduct: 0.45,
    temp: 350,
    tempLow: 280,
    stateLow: "silver_indium_cadmium_alloy"
};

elements.silver_indium_cadmium_alloy.reactions = {
    "neutron": { elem1: "silver_indium_cadmium_alloy", elem2: null, chance: 0.85, temp1: 20 }
};

elements.molten_silver_indium_cadmium.reactions = {
    "neutron": { elem1: "molten_silver_indium_cadmium", elem2: null, chance: 0.75, temp1: 300 }
};

elements.hafnium_cadmium_alloy = {
    color: ["#999999", "#888888", "#777777"],
    state: "solid",
    category: "solids",
    behavior: behaviors.WALL,
    density: 12000,
    hardness: 0.9,
    conduct: 0.55,
    temp: 20
};

elements.hafnium_cadmium_alloy.reactions = {
    "neutron": { elem1: "hafnium_cadmium_alloy", elem2: null, chance: 0.99, temp1: 20 }
};

elements.molten_cadmium.reactions["molten_silver_indium_cadmium"] = { 
    elem1: "hafnium_cadmium_alloy", 
    elem2: null, 
    temp1: 300, 
    temp2: 300 
};

elements.molten_silver_indium_cadmium.reactions["molten_cadmium"] = { 
    elem1: "hafnium_cadmium_alloy", 
    elem2: null, 
    temp1: 300, 
    temp2: 300 
};

elements.molten_cadmium.reactions["hafnium"] = { 
    elem1: "hafnium_cadmium_alloy", 
    elem2: null, 
    temp1: 300, 
    temp2: 2150 
};

elements.molten_silver_indium_cadmium.reactions["hafnium"] = { 
    elem1: "hafnium_cadmium_alloy", 
    elem2: null, 
    temp1: 300, 
    temp2: 2150 
};