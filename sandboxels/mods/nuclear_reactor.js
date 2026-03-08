delete elements.neutron;

elements.pressurized_water = {
    color: "#2066fe",
    behavior: behaviors.LIQUID,
    category: "liquids",
    state: "liquid"
}

elements.control_rod = {
    color: "#555555",
    behavior: [
        "XX|DL:neutron,proton|XX",
        "DL:neutron,proton|XX|DL:neutron,proton",
        "XX|DL:neutron,proton|XX",
    ],
    category: "machines",
    state: "solid"
}

elements.nuclear_fuel_rod = {
    color: "#333333",
    behavior: [
        "XX|XX|XX",
        "XX|XX|XX",
        "XX|XX|XX"
    ],
    reactions: {
        neutron: {
            chance: 0.2,
            func(pixel1, pixel2) {
                deletePixel(pixel2.x, pixel2.y);
                let emit = 2;
                if (Math.random() < 0.25) {
                    emit = 3;
                }

                for (let n = 0; n < emit; n++) {
                    let spawned = false;
                    for (let dx = -1; dx <= 1 && !spawned; dx++) {
                        for (let dy = -1; dy <= 1 && !spawned; dy++) {
                            if (dx === 0 && dy === 0) continue;

                            let nx = pixel1.x + dx;
                            let ny = pixel1.y + dy;

                            if (isEmpty(nx, ny)) {
                                createPixel("neutron", nx, ny);
                                spawned = true;
                            }
                        }
                    }
                }

                if (pixel1.temp >= 700 && Math.random() < 0.05) {
                    changePixel(pixel1, "n_explosion");
                }
            }
        }
    },
    category: "solids",
    state: "solid",
    excludeRandom: true
}

elements.neutron = {
    color: "#a6ffff",
    behavior: [
        "XX|XX|XX",
        "XX|CH:proton%0.25 AND DL%0.25|XX",
        "XX|XX|XX"
    ],
    tick: behaviors.BOUNCY,
    reactions: {
        uranium: { temp2: 100 },
        nuclear_fuel_rod: { temp2: 125 },
        plant: { elem2: "wood", chance: 0.05 },
        gunpowder: { elem2: "dust", chance: 0.05 },
        yeast: { elem2: "bread", chance: 0.05 },
        silver: { elem1: ["radiation", null, null], chance: 0.25 },
        firework: { func(pixel1, pixel2){ pixel2.burning = true; pixel2.burnStart = pixelTicks }, chance: 0.01 },
        glass: { elem1: null, elem2: "rad_glass" },
        glass_shard: { elem1: null, elem2: "rad_shard" },
        cloud: { elem1: null, elem2: "rad_cloud" },
        rain_cloud: { elem1: null, elem2: "rad_cloud" }
    },
    temp: 35,
    category: "energy",
    state: "gas",
    density: 0.00003,
    ignoreAir: true
}
