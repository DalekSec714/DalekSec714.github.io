/*
Umkehr-Mod fuer die im Screenshot gezeigten Elemente.
Enthaelt genau diese Gegenstuecke:
Feuer, Plasma, KaltesFeuer, Licht, Laser, RadioaktiveStrahlung,
Neutron, Proton, Elektrisch, Blitz, Segen, GottsStrahl,
Hitzestrahl, Frierstrahl, Explosion, Kochen, Verbrennen, Zimmertemperatur.
*/

(function() {
    var CURSE_COLORS = ["#1b172b", "#2a1420", "#2f2f3b"];

    function isInsulatedPixel(pixel) {
        return !!(elements[pixel.element] && elements[pixel.element].insulate);
    }

    function shiftTemp(pixel, delta) {
        if (isInsulatedPixel(pixel)) { return; }
        pixel.temp += delta;
        pixelTempCheck(pixel);
    }

    function stopBurning(pixel) {
        if (!pixel.burning) { return; }
        delete pixel.burning;
        delete pixel.burnStart;
    }

    function removeCharge(pixel) {
        if (!pixel.charge) { return; }
        delete pixel.charge;
        pixel.chargeCD = 16;
    }

    function darkenPixel(pixel) {
        if (Math.random() < 0.15) {
            pixel.color = pixelColorPick(pixel, CURSE_COLORS);
        }
    }

    // Umkehr von Feuer
    elements.umkehr_feuer = {
        name: "Umkehr Feuer",
        color: ["#6ad4ff", "#00b7ff"],
        buttonColor: ["#00c8ff", "#6cd8ff", "#8fe9ff"],
        tick: function(pixel) {
            behaviors.GAS(pixel);
            if (!pixel.del && Math.random() < 0.08) { changePixel(pixel, "smoke"); }
        },
        tool: function(pixel) {
            stopBurning(pixel);
            if (pixel.temp <= -600 || isInsulatedPixel(pixel)) { return; }
            pixel.temp -= 600 / (elements[pixel.element].extinguish ? 240 : 60);
            pixelTempCheck(pixel);
        },
        canPlace: true,
        renderer: renderPresets.HUESHIFT,
        temp: -600,
        tempHigh: -100,
        stateHigh: "cold_fire",
        category: "energy",
        state: "gas",
        density: 0.1,
        noMix: true
    };

    // Umkehr von Plasma
    elements.umkehr_plasma = {
        name: "Umkehr Plasma",
        color: ["#8ee8ff", "#53d8ff", "#2db5ff"],
        behavior: behaviors.DGAS,
        tool: function(pixel) {
            if (pixel.temp <= -7065 || isInsulatedPixel(pixel)) { return; }
            pixel.temp -= Math.abs(elements.plasma.temp) / (elements[pixel.element].extinguish ? 240 : 60);
            pixelTempCheck(pixel);
        },
        canPlace: true,
        temp: -7065,
        tempHigh: -5000,
        stateHigh: "umkehr_feuer",
        category: "energy",
        state: "gas",
        density: 1,
        conduct: 1
    };

    // Umkehr von KaltesFeuer
    elements.umkehr_kaltesfeuer = {
        name: "Umkehr KaltesFeuer",
        color: ["#ffca66", "#ff9f3d", "#ff7a00"],
        buttonColor: ["#ffbf4a", "#ff8c33", "#ff622e"],
        tick: function(pixel) {
            behaviors.GAS(pixel);
            doHeat(pixel);
            if (!pixel.del && Math.random() < 0.08) { changePixel(pixel, "smoke"); }
        },
        tool: function(pixel) {
            if (pixel.temp >= 1200 || isInsulatedPixel(pixel)) { return; }
            pixel.temp += 1200 / (elements[pixel.element].extinguish ? 240 : 60);
            pixelTempCheck(pixel);
        },
        canPlace: true,
        reactions: {
            "cold_fire": { elem1: "smoke", elem2: "smoke" },
            "umkehr_feuer": { elem1: "smoke", elem2: "smoke" }
        },
        renderer: renderPresets.HUESHIFT,
        temp: 1200,
        tempLow: 200,
        stateLow: "fire",
        category: "energy",
        burning: true,
        burnTime: 25,
        burnInto: "smoke",
        state: "gas",
        density: 0.1,
        noMix: true
    };

    // Umkehr von Licht
    elements.umkehr_licht = {
        name: "Umkehr Licht",
        color: "#1a2035",
        tick: function(pixel) {
            if (Math.random() < 0.02) {
                deletePixel(pixel.x, pixel.y);
                return;
            }
            if (pixel.bx === undefined) {
                pixel.bx = Math.random() < 0.5 ? 1 : Math.random() < 0.5 ? 0 : -1;
                pixel.by = Math.random() < 0.5 ? 1 : Math.random() < 0.5 ? 0 : -1;
                if (pixel.bx === 0 && pixel.by === 0) {
                    if (Math.random() < 0.5) { pixel.bx = Math.random() < 0.5 ? 1 : -1; }
                    else { pixel.by = Math.random() < 0.5 ? 1 : -1; }
                }
            }
            if (pixel.bx && !tryMove(pixel, pixel.x + pixel.bx, pixel.y)) {
                var hitX = pixel.x + pixel.bx;
                if (!isEmpty(hitX, pixel.y, true)) {
                    var hitPixelX = pixelMap[hitX][pixel.y];
                    if (!isInsulatedPixel(hitPixelX)) {
                        hitPixelX.temp -= 1;
                        pixelTempCheck(hitPixelX);
                    }
                    darkenPixel(hitPixelX);
                    pixel.color = "#141a2b";
                }
                pixel.bx = -pixel.bx;
            }
            if (!pixel.del && pixel.by && !tryMove(pixel, pixel.x, pixel.y + pixel.by)) {
                var hitY = pixel.y + pixel.by;
                if (!isEmpty(pixel.x, hitY, true)) {
                    var hitPixelY = pixelMap[pixel.x][hitY];
                    if (!isInsulatedPixel(hitPixelY)) {
                        hitPixelY.temp -= 1;
                        pixelTempCheck(hitPixelY);
                    }
                    darkenPixel(hitPixelY);
                    pixel.color = "#141a2b";
                }
                pixel.by = -pixel.by;
            }
        },
        reactions: {
            "light": { elem2: "umkehr_licht" },
            "laser": { elem2: "umkehr_laser" }
        },
        temp: -35,
        category: "energy",
        state: "gas",
        density: 0.00001,
        ignoreAir: true,
        insulate: true
    };

    // Umkehr von Laser
    elements.umkehr_laser = {
        name: "Umkehr Laser",
        color: "#00c6ff",
        behavior: [
            "XX|XX|XX",
            "XX|DL%0.25|XX",
            "XX|XX|XX"
        ],
        tick: function(pixel) {
            behaviors.BOUNCY(pixel);
            if (pixel.del) { return; }
            var coord = adjacentCoords[Math.floor(Math.random() * adjacentCoords.length)];
            var tx = pixel.x + coord[0];
            var ty = pixel.y + coord[1];
            if (!isEmpty(tx, ty, true)) {
                var target = pixelMap[tx][ty];
                if (!isInsulatedPixel(target)) {
                    target.temp -= 5;
                    pixelTempCheck(target);
                }
            }
        },
        temp: -35,
        breakInto: "umkehr_licht",
        breakIntoColor: "#b7eaff",
        category: "energy",
        state: "gas",
        density: 0.00001,
        ignoreAir: true
    };

    // Umkehr von RadioaktiveStrahlung
    elements.umkehr_radioaktive_strahlung = {
        name: "Umkehr RadioaktiveStrahlung",
        color: ["#8be8b3", "#6fdca0"],
        behavior: [
            "XX|M1%0.5|XX",
            "M1%7|DL%3|M1%7",
            "XX|M1%1|XX"
        ],
        tool: function(pixel) {
            if (pixel.element === "radiation") { changePixel(pixel, "flash"); return; }
            if (pixel.element === "fallout") { deletePixel(pixel.x, pixel.y); return; }
            if (pixel.element === "rad_steam") { changePixel(pixel, "steam"); return; }
            if (pixel.element === "rad_cloud") { changePixel(pixel, "rain_cloud"); return; }
            if (pixel.element === "rad_glass") { changePixel(pixel, "glass"); return; }
            if (pixel.element === "rad_shard") { changePixel(pixel, "glass_shard"); return; }
            stopBurning(pixel);
            removeCharge(pixel);
            if (!isInsulatedPixel(pixel)) {
                pixel.temp = (pixel.temp + 20) / 2;
                pixelTempCheck(pixel);
            }
        },
        reactions: {
            "radiation": { elem2: "flash" },
            "fallout": { elem2: null },
            "rad_steam": { elem2: "steam" },
            "rad_cloud": { elem2: "rain_cloud" },
            "rad_glass": { elem2: "glass" },
            "rad_shard": { elem2: "glass_shard" },
            "uranium": { elem2: "rock" },
            "molten_uranium": { elem2: "magma" }
        },
        state: "gas",
        density: 1.5,
        category: "energy"
    };

    // Umkehr von Neutron
    elements.umkehr_neutron = {
        name: "Umkehr Neutron",
        color: "#ff9b9b",
        behavior: [
            "XX|XX|XX",
            "XX|CH:proton%0.25 AND DL%0.25|XX",
            "XX|XX|XX"
        ],
        tick: behaviors.BOUNCY,
        reactions: {
            "neutron": { elem2: "proton", chance: 0.8 },
            "electric": { elem2: null, chance: 0.25 }
        },
        temp: 40,
        category: "energy",
        state: "gas",
        density: 0.00002,
        ignoreAir: true,
        conduct: 1
    };

    // Umkehr von Proton
    elements.umkehr_proton = {
        name: "Umkehr Proton",
        color: "#9bf7ff",
        behavior: [
            "XX|XX|XX",
            "XX|CH:neutron%0.25 AND DL%0.5|XX",
            "XX|XX|XX"
        ],
        tick: behaviors.BOUNCY,
        reactions: {
            "proton": { elem2: "neutron", chance: 0.8 },
            "electric": { elem2: null, chance: 0.25 }
        },
        temp: 35,
        category: "energy",
        state: "gas",
        density: 0.00003,
        ignoreAir: true
    };

    // Umkehr von Elektrisch
    elements.umkehr_elektrisch = {
        name: "Umkehr Elektrisch",
        color: "#8ea9c2",
        behavior: [
            "M1%5|DL%10|M1%5",
            "DL%10|DL%30|DL%10",
            "M1%5|M1%20|M1%5"
        ],
        tool: function(pixel) {
            removeCharge(pixel);
            shiftTemp(pixel, -2);
        },
        reactions: {
            "electric": { elem2: null },
            "lightning": { elem2: "flash" },
            "proton": { elem2: "neutron" },
            "neutron": { elem2: "proton" }
        },
        category: "energy",
        state: "gas",
        density: 2.1,
        insulate: true,
        ignoreAir: true
    };

    // Umkehr von Blitz
    elements.umkehr_blitz = {
        name: "Umkehr Blitz",
        color: "#9cd6ff",
        tick: function(pixel) {
            if (!pixel.stage) {
                var y = pixel.y;
                var xoffset = 0;
                var last = [pixel.x, pixel.y];
                for (var i = 0; i < height - pixel.y + 1; i++) {
                    y++;
                    if (Math.random() > 0.5) { xoffset++; }
                    else { xoffset--; }
                    var x = pixel.x + xoffset;
                    if (isEmpty(x, y)) {
                        createPixel("umkehr_blitz", x, y);
                        pixelMap[x][y].stage = 1;
                        last = [x, y];
                    }
                    else if (outOfBounds(x, y) || !elements[pixelMap[x][y].element].isGas) {
                        if (!outOfBounds(x, y) && !isInsulatedPixel(pixelMap[x][y])) {
                            pixelMap[x][y].temp = -120;
                            pixelTempCheck(pixelMap[x][y]);
                        }
                        explodeAt(last[0], last[1], 8, ["umkehr_elektrisch", "cold_fire", "cold_fire"]);
                        break;
                    }
                }
                deletePixel(pixel.x, pixel.y);
            }
            else if (pixelTicks - pixel.start >= 4) {
                changePixel(pixel, "umkehr_elektrisch");
            }
            else {
                doDefaults(pixel);
                pixel.alpha = (pixel.alpha || 1) / 1.5;
            }
        },
        temp: -120,
        tempLow: -273,
        stateLow: ["liquid_light", null],
        category: "energy",
        state: "gas",
        maxSize: 1,
        cooldown: defaultCooldown,
        density: 1000,
        hardness: 1,
        excludeRandom: true,
        noMix: true
    };

    // Umkehr von Segen
    elements.umkehr_segen = {
        name: "Umkehr Segen",
        color: ["#5a1f6e", "#7d2f44", "#2f356d"],
        tool: function(pixel) {
            if (elements.umkehr_segen.ignore.indexOf(pixel.element) !== -1) { return; }

            if (!isInsulatedPixel(pixel)) {
                if (pixel.temp >= airTemp) { pixel.temp += 60; }
                else { pixel.temp -= 60; }
                pixelTempCheck(pixel);
                if (pixel.del) { return; }
            }

            if (!pixel.burning && elements[pixel.element].burn) { burnPixel(pixel); }
            if (!pixel.charge && Math.random() < 0.35) { pixel.charge = 1; }
            darkenPixel(pixel);

            if (elements.umkehr_segen.reactions[pixel.element] && Math.random() < 0.25) {
                var r = elements.umkehr_segen.reactions[pixel.element];
                var elem2 = r.elem2;
                if (elem2 !== undefined) {
                    if (Array.isArray(elem2)) { elem2 = elem2[Math.floor(Math.random() * elem2.length)]; }
                    if (elem2 === null) { deletePixel(pixel.x, pixel.y); }
                    else { changePixel(pixel, elem2); }
                }
                if (r.func) { r.func(pixel, pixel); }
                if (r.color2) { pixel.color = pixelColorPick(pixel, r.color2); }
            }
        },
        ignore: ["sun"],
        behavior: [
            "M2|M1|M2",
            "M1|DL%25|M1",
            "M2|M1|M2"
        ],
        reactions: {
            "water": { elem2: "dirty_water" },
            "steam": { elem2: "smog" },
            "rain_cloud": { elem2: "rad_cloud" },
            "cloud": { elem2: "rad_cloud" },
            "plant": { elem2: "dead_plant" },
            "grass": { elem2: "dead_plant" },
            "antibody": { elem2: "infection" },
            "blood": { elem2: "infection" },
            "fire": { elem2: "plasma" },
            "bless": { elem2: "umkehr_segen" },
            "light": { elem2: "laser" },
            "glass": { elem2: "rad_glass" },
            "ice": { elem2: "dirty_ice" },
            "head": { attr2: { panic: 20 } },
            "body": { attr2: { panic: 20 } }
        },
        temp: 20,
        state: "gas",
        density: 0.001,
        canPlace: true,
        category: "energy",
        stain: 0.35
    };

    // Umkehr von GottsStrahl
    elements.umkehr_gottsstrahl = {
        name: "Umkehr GottsStrahl",
        color: ["#261635", "#3b2347"],
        tick: function(pixel) {
            var x = pixel.x;
            for (var y = pixel.y + 1; y < height + 1; y++) {
                if (outOfBounds(x, y)) {
                    if (isEmpty(x, y - 1)) { createPixel("umkehr_segen", x, y - 1); }
                    break;
                }
                if (isEmpty(x, y)) {
                    if (Math.random() > 0.1) { continue; }
                    createPixel("smoke", x, y);
                    pixelMap[x][y].temp = -80;
                }
                else {
                    if (elements[pixelMap[x][y].element].id === elements.umkehr_gottsstrahl.id) { break; }
                    if (!elements[pixelMap[x][y].element].isGas && isEmpty(x, y - 1)) {
                        createPixel("umkehr_segen", x, y - 1);
                    }
                    if (Math.random() > 0.1) { continue; }
                    elements.umkehr_segen.tool(pixelMap[x][y]);
                }
            }
            deletePixel(pixel.x, pixel.y);
        },
        category: "energy",
        state: "gas",
        density: 1,
        excludeRandom: true,
        noMix: true
    };

    // Umkehr von Hitzestrahl
    elements.umkehr_hitzestrahl = {
        name: "Umkehr Hitzestrahl",
        color: ["#00ffff", "#00b3ff"],
        tick: function(pixel) {
            var x = pixel.x;
            for (var y = pixel.y; y < height + 1; y++) {
                if (outOfBounds(x, y)) {
                    if (isEmpty(x, y - 1)) { createPixel("cold_fire", x, y - 1); }
                    break;
                }
                if (isEmpty(x, y)) {
                    if (Math.random() > 0.05) { continue; }
                    createPixel("flash", x, y);
                    pixelMap[x][y].color = "#00ffff";
                    pixelMap[x][y].temp = -300;
                    pixelMap[x][y].delay = (y - pixel.y) / 8;
                }
                else {
                    if (elements[pixelMap[x][y].element].isGas) { continue; }
                    if (elements[pixelMap[x][y].element].id === elements.umkehr_hitzestrahl.id) {
                        pixelMap[x][y].temp = -300;
                        break;
                    }
                    if (!isInsulatedPixel(pixelMap[x][y])) { pixelMap[x][y].temp -= 100; }
                    pixelTempCheck(pixelMap[x][y]);
                    break;
                }
            }
            deletePixel(pixel.x, pixel.y);
        },
        temp: -270,
        category: "energy",
        state: "gas",
        density: 1,
        excludeRandom: true,
        noMix: true
    };

    // Umkehr von Frierstrahl
    elements.umkehr_frierstrahl = {
        name: "Umkehr Frierstrahl",
        color: ["#ff0000", "#ff5e00"],
        tick: function(pixel) {
            var x = pixel.x;
            for (var y = pixel.y; y < height + 1; y++) {
                if (outOfBounds(x, y)) {
                    if (isEmpty(x, y - 1)) { createPixel("fire", x, y - 1); }
                    break;
                }
                if (isEmpty(x, y)) {
                    if (Math.random() > 0.05) { continue; }
                    createPixel("flash", x, y);
                    pixelMap[x][y].color = "#ff0000";
                    pixelMap[x][y].temp = 3500;
                    pixelMap[x][y].delay = (y - pixel.y) / 8;
                }
                else {
                    if (elements[pixelMap[x][y].element].isGas) { continue; }
                    else if (isEmpty(x, y - 1)) { createPixel("fire", x, y - 1); }
                    if (elements[pixelMap[x][y].element].id === elements.umkehr_frierstrahl.id) {
                        pixelMap[x][y].temp = 3500;
                        break;
                    }
                    if (!isInsulatedPixel(pixelMap[x][y])) { pixelMap[x][y].temp += 100; }
                    pixelTempCheck(pixelMap[x][y]);
                    break;
                }
            }
            deletePixel(pixel.x, pixel.y);
        },
        temp: 3500,
        category: "energy",
        state: "gas",
        density: 1,
        excludeRandom: true,
        noMix: true
    };

    // Umkehr von Explosion
    elements.umkehr_explosion = {
        name: "Implosion",
        color: ["#8fa8ff", "#aeb5d1", "#6c84c9"],
        behavior: behaviors.WALL,
        onShiftSelect: function(element) {
            promptInput("Enter a radius from 1 to 100. (Default 10)", function(r) {
                if (!r) return;
                r = parseInt(r, 10);
                if (isNaN(r)) return;
                r = Math.min(100, r);
                r = Math.max(1, r);
                currentElementProp = { radius: r };
            }, elemTitleCase(elements[element].name || element));
        },
        tick: function(pixel) {
            var radius = pixel.radius || 10;
            var coords = circleCoords(pixel.x, pixel.y, radius);
            for (var i = 0; i < coords.length; i++) {
                var c = coords[i];
                if (outOfBounds(c.x, c.y)) { continue; }
                if (isEmpty(c.x, c.y, true)) { continue; }
                var target = pixelMap[c.x][c.y];
                if (target === pixel) { continue; }
                var dx = Math.sign(pixel.x - target.x);
                var dy = Math.sign(pixel.y - target.y);
                if (dx !== 0 || dy !== 0) {
                    tryMove(target, target.x + dx, target.y + dy);
                }
                if (!isInsulatedPixel(target)) {
                    target.temp -= 15;
                    pixelTempCheck(target);
                }
            }
            explodeAt(pixel.x, pixel.y, Math.max(2, Math.floor(radius / 3)), ["cold_fire", "smoke"]);
            deletePixel(pixel.x, pixel.y);
        },
        temp: -50,
        category: "energy",
        state: "gas",
        density: 1000,
        excludeRandom: true,
        noMix: true
    };

    // Umkehr von Kochen
    elements.umkehr_kochen = {
        name: "Abkuehlen",
        color: ["#225c7d", "#173a52", "#26698f"],
        tool: function(pixel) {
            if (!shiftDown) { pixel.temp -= 0.5; }
            else { pixel.temp -= 1; }
            pixelTempCheck(pixel);
        },
        category: "energy"
    };

    // Umkehr von Verbrennen
    elements.einfrieren = {
        name: "Einfrieren",
        color: ["#00e5ff", "#7be8ff", "#b0f5ff"],
        tool: function(pixel) {
            pixel.temp -= 10000;
            stopBurning(pixel);
            removeCharge(pixel);
            pixelTempCheck(pixel);
        },
        category: "energy"
    };

    // Umkehr von Zimmertemperatur
    elements.umkehr_zimmertemperatur = {
        name: "Umkehr Zimmertemperatur",
        color: "#5c3d2e",
        tool: function(pixel) {
            var diff = pixel.temp - airTemp;
            if (Math.abs(diff) < 10) {
                pixel.temp += (Math.random() < 0.5 ? -150 : 150);
            }
            else {
                pixel.temp += diff * 0.5;
            }
            pixelTempCheck(pixel);
        },
        category: "energy"
    };
})();
