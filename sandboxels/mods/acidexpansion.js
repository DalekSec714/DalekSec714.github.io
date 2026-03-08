elements.hydrochloric_acid = {
  color: "#ffbb00",
  behavior: behaviors.LIQUID,
  category: "liquids",
  state: "liquid",
  density: 1100,
  viscosity: 1,
  tempHigh: 110,
  stateHigh: "hcl_gas",
  reactions: {
    "iron": {
      elem1: "hydrogen_bubble",
      elem2: "iron_chloride",
      chance: 0.1,
      temp1: 20
    },
    "aluminum": {
      elem1: "hydrogen",
      elem2: null,
      chance: 0.2,
      temp1: 50
    },
    "zinc": {
      elem1: "hydrogen",
      elem2: null,
      chance: 0.15
    },
    "limestone": {
      elem1: "hydrogen_bubble",
      elem2: "calcium_chloride",
      chance: 0.15,
      temp1: 30
    },
    "baking_soda": {
      elem1: "salt_water",
      elem2: "carbon_dioxide"
    },
    "plant": {
      elem1: null,
      elem2: "dead_plant",
      chance: 0.03
    },
    "meat": {
      elem1: null,
      elem2: "rotten_meat",
      chance: 0.02
    },
  },
};

elements.hcl_gas = {
  color: "#f2ffe6",
  behavior: behaviors.GAS,
  category: "gases",
  state: "gas",
  density: 1.5,
  reactions: {
    "water": {
      elem1: "hydrochloric_acid",
      elem2: null,
      chance: 0.1
    },
    "plant": {
      elem1: null,
      elem2: "dead_plant",
      chance: 0.05
    },
  },
};

elements.calcium_chloride = {
  color: "#e3e3e3",
  behavior: behaviors.POWDER,
  category: "powders",
  state: "solid",
  density: 2150,
  tempHigh: 1200,
  stateHigh: "molten_salt",
  reactions: {
    "water": {
      elem1: "salt_water",
      chance: 0.1
    },
    "fire": {
      elem1: "molten_salt",
      chance: 0.1
    },
  },
};

elements.hydrogen_bubble = {
  color: "#0070ff",
  behavior: [
    "M2|M1|M2",
    "M1|XX|M1",
    "M2|M1|M2",
  ],
  category: "gases",
  state: "gas",
  density: 1,
  reactions: {
    "fire": {
      elem1: "explosion",
      chance: 0.1,
    },
    "air": {
      elem1: "hydrogen",
      chance: 0.3
    }
  },
};

elements.iron_chloride = {
  color: "#4d3319",
  behavior: behaviors.POWDER,
  category: "powders",
  state: "solid",
};

elements.carbonic_acid = {
  color: "#d1f2ff", 
  behavior: behaviors.LIQUID,
  category: "liquids",
  state: "liquid",
  density: 1010,
  viscosity: 1,
  tempHigh: 50,
  stateHigh: "carbon_dioxide",
  reactions: {
    "air": {
      elem1: "water",
      elem2: "carbon_dioxide",
      chance: 0.01
    },
    "limestone": {
      elem1: "water",
      elem2: "carbon_dioxide",
      chance: 0.05
    },
    "calcium": {
      elem1: "hydrogen_bubble",
      elem2: null,
      chance: 0.1
    }
  },
};

elements.sulfuric_acid = {
  color: "#f2e0a1",
  behavior: behaviors.LIQUID,
  category: "liquids",
  state: "liquid",
  density: 1840,
  viscosity: 24.2,
  reactions: {
    "sugar": {
      elem1: "charcoal",
      elem2: "water",
      chance: 0.15
    },
    "zinc": {
      elem1: "zinc_sulfate",
      elem2: "hydrogen",
      chance: 0.2
    },
    "copper": {
      elem1: "copper_sulfate",
      elem2: "sulfur_dioxide",
      elem3: "water",
      chance: 0.2
    },
    "water": {
      elem1: "explosion",
      chance: 0.2
    },
  }
}

elements.sulfurous_acid = {
  color: "#f0f8ff",
  behavior: behaviors.LIQUID,
  category: "liquids",
  state: "liquid",
  density: 1030,
  viscosity: 1,
  tempHigh: 7,
  stateHigh: ["water", "sulfur_dioxide"],
  reactions: {
    "iodine_water": {
      elem1: "sulfuric_acid",
      elem2: "hydrogen_iodide",
      chance: 0.15
    },
    "oxygen": {
      elem1: "sulfuric_acid",
      chance: 0.2
    },
  },
};

elements.zinc_sulfate = {
  color: "#cccccc",
  behavior: behaviors.POWDER,
  category: "powders",
  state: "solid",
  density: 3800,
  tempHigh: 680,
  stateHigh: ["zinc_oxide", "sulfur_trioxide"],
  reactions: {
    "calcium_hydroxide": {
      elem1: "calcium_sulfate",
      elem2: "zinc_hydroxide",
      chance: 0.2
    }
  }
};

elements.sulfur_dioxide = {
  color: "#bbbbbb",
  behavior: behaviors.GAS,
  category: "gases",
  state: "gas",
  density: 2927,
  reactions: {
    "water": {
      elem1: "sulfurous_acid",
      chance: 0.1
    },
    "oxygen": {
      elem1: "sulfur_trioxide",
      chance: 0.1
    },
    "sodium_hydroxide": {
      elem1: "sodium_sulfite",
      elem2: "water",
      chance: 0.1
    },
    "chlorine": {
      elem1: "sulfuryl_chloride",
      chance: 0.1
    },
    "hydrogen_sulfide": {
      elem1: "sulfur",
      elem2: "water",
      chance: 0.2
    }
  },
};

elements.sulfur_trioxide = {
  color: "#dddddd",
  behavior: behaviors.POWDER,
  category: "powders",
  state: "solid",
  density: 1920,
  tempHigh: 44.6,
  stateHigh: ["sulfur", "oxygen"]
};

elements.copper_sulfate = {
  color: "#0066ff",
  behavior: behaviors.POWDER,
  category: "powders",
  state: "solid",
  density: 2286,
  reactions: {
    "zinc": {
      elem1: "copper",
      elem2: "zinc_sulfate",
      chance: 0.2
    },
    "iron": {
      elem1: "iron_sulfate",
      elem2: "copper",
      chance: 0.2
    },
    "hydrochloric_acid": {
      elem1: "tetrachlorocuprate",
      chance: 0.1,
    },
    "water": {
      elem1: "copper_sulfate_water",
      chance: 0.1
    }
  }
};

elements.iodine_water = {
  color: "#b8433c",
  behavior: behaviors.LIQUID,
  category: "liquids",
  state: "liquid",
};

elements.hydrogen_iodide = {
  color: "#aaaaaa",
  behavior: behaviors.GAS,
  category: "gases",
  state: "gas",
  density: 5.66,
  tempHigh: -35.36,
};

elements.iron_sulfate = {
  color: "#6c9a7d",
  behavior: behaviors.POWDER,
  category: "powders",
  state: "solid",
  reactions: {
    "water": {
      elem1: "iron_sulfate_water",
      chance: 0.1
    }
  }
};

elements.tetrachlorocuprate = {
  color: "#64b534",
  behavior: behaviors.LIQUID,
  category: "liquids",
  state: "liquid",
};

elements.copper_sulfate_water = {
  color: "#00aaff",
  behavior: behaviors.LIQUID,
  category: "liquids",
  state: "liquid",
};

elements.sulfuryl_chloride = {
  color: "#ffffe0",
  behavior: behaviors.LIQUID,
  category: "liquids",
  state: "liquid",
  density: 1670,
  viscosity: 0.595,
  tempHigh: 69,
  stateHigh: ["sulfur_dioxide", "water"],
};

elements.sodium_hydroxide = {
  color: "#999999",
  behavior: behaviors.POWDER,
  category: "powders",
  state: "solid",
  density: 2130,
  reactions: {
    "water": {
      elem1: "NaOH_water",
      chance: 0.1
    }
  }
};

elements.NaOH_water = {
  color: "#0000ff",
  behavior: behaviors.LIQUID,
  category: "liquids",
  state: "liquid",
};

elements.calcium_hydroxide = {
  color: "#cdcdcd",
  behavior: behaviors.POWDER,
  category: "powders",
  state: "solid",
  density: 640,
  tempHigh: 580,
  stateHigh: ["calcium_oxide", "water"]
};

elements.calcium_oxide = {
    color: "#fdfdfd",
    behavior: behaviors.POWDER,
    category: "powders",
    state: "solid",
    density: 1200,
    tempHigh: 2850,
    stateHigh: "molten_calcium_oxide",
    reactions: {
        "water": {
            elem1: "calcium_hydroxide",
            chance: 0.1
        }
    },
    onTick: function(pixel) {
        if (pixel.temp >= 2000) {
            if (Math.random() < 0.1) {
                var x = pixel.x;
                var y = pixel.y;
                var offsets = [[-1,-1], [0,-1], [1,-1], [-1,0], [1,0], [-1,1], [0,1], [1,1]];
                var offset = offsets[Math.floor(Math.random() * offsets.length)];
                if (isEmpty(x + offset[0], y + offset[1])) {
                    createPixel("light", x + offset[0], y + offset[1]);
                }
            }
        }
    }
};

elements.molten_calcium_oxide = {
  color: "#fffde3",
  behavior: behaviors.POWDER,
  category: "other",
  state: "solid",
  temp: 2860,
  tempHigh: 3090,
  stateHigh: "smoke",
  glow: true,
  tick: function(pixel) {
    pixel.temp -= 1;
  },
  tempLow: 2850,
  stateLow: "calcium_oxide",
};

elements.calcium_sulfate = {
  color: "#aaaaaa",
  behavior: behaviors.POWDER,
  category: "powders",
  state: "solid",
  density: 2960,
  tempHigh: 1450,
  stateHigh: ["calcium_oxide", "sulfur_dioxide", "oxygen"],
};

elements.zinc_hydroxide = {
  color: "#eeeeee",
  behavior: behaviors.POWDER,
  category: "powders",
  state: "solid",
  density: 3053,
  tempHigh: 127,
  stateHigh: ["zinc_oxide", "water"]
};

elements.hydrogen_sulfide = {
  color: "#676767",
  behavior: behaviors.GAS,
  category: "gases",
  state: "gas",
  density: 1.434,
  flammability: 0.46,
  burnsInto: ["steam", "sulfur_dioxide"],
  burnTime: 10,
  fireColor: "#00ffff"
};

elements.zinc_oxide = {
  color: "#f9faff",
  behavior: behaviors.POWDER,
  category: "powders",
  state: "solid",
  density: 5606,
  tempHigh: 1975,
  stateHigh: ["molten_zinc", "oxygen"],
};

// fun element
elements.ae_ocean_water = {
  color: "#22bbff",
  behavior: behaviors.LIQUID,
  category: "liquids",
  state: "liquid",
  density: 1100,
  viscosity: 1,
  tempHigh: 100,
  stateHigh: ["steam", "salt", "calcium_chloride", "ocean_water_rain_cloud"],
  reactions: {
    "iron": {
      elem1: "rust",
      elem2: null,
      chance: 0.3 // because it is saltier than salt water
    },
    "steel": {
      elem1: "rust",
      elem2: null,
      chance: 0.25
    },
    "plant": {
      elem1: "dead_plant",
      chance: 0.28
    },
  },
};

elements.ocean_water_rain_cloud = {
  color: "#343434",
  behavior: [
    "M2|M1|M2",
    "M1|XX|M1",
    "CR:electric%0.5|CH:ae_ocean_water%1|M2",
  ],
  temp: 20,
  category: "gases",
  state: "gas",
  density: 0.5,
  excludeRandom: true,
  reactions: {
    "thunder_cloud": {
      elem1: "ocean_water_thunder_cloud",
      chance: 0.1
    }
  }
};


elements.ocean_water_thunder_cloud = {
  color: "#222222",
  behavior: [
    "M2|M1|M2",
    "M1|XX|M1",
    "CR:lightning%0.01|CH:ae_ocean_water%1|M2",
  ],
  temp: 20,
  category: "gases",
  state: "gas",
  density: 0.5,
  excludeRandom: true,
};

if (!elements.water.reactions) {
  elements.water.reactions = {}
}
if (!elements.salt_water.reactions) {
  elements.salt_water.reactions = {}
}

elements.water.reactions.carbon_dioxide = {
  elem1: "carbonic_acid",
  chance: 0.08
};

elements.salt_water.reactions.calcium_chloride = {
  elem1: "ae_ocean_water",
  chance: 0.15
}
