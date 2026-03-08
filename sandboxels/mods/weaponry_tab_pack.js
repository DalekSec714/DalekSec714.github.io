/*
Weaponry Tab Pack
Adds a new category tab: Weaponry
All element names are in English.
*/

(function () {
    var CATEGORY = "weaponry";

    function heatTarget(target, amount) {
        if (!target) { return; }
        if (!elements[target.element].insulate) {
            target.temp += amount;
            pixelTempCheck(target);
        }
    }

    function damageTarget(target, breakChance, deleteChance) {
        if (!target) { return; }
        if (Math.random() < breakChance && isBreakable(target)) {
            breakPixel(target);
        }
        if (!target.del && Math.random() < deleteChance) {
            deletePixel(target.x, target.y);
        }
    }

    function moveLinear(pixel, vx, vy, speed, onImpact) {
        for (var i = 0; i < speed; i++) {
            var nx = pixel.x + vx;
            var ny = pixel.y + vy;
            if (outOfBounds(nx, ny)) {
                deletePixel(pixel.x, pixel.y);
                return false;
            }
            if (isEmpty(nx, ny)) {
                if (!tryMove(pixel, nx, ny) && !isEmpty(nx, ny, true)) {
                    onImpact(pixel, pixelMap[nx][ny]);
                    return false;
                }
                continue;
            }
            onImpact(pixel, pixelMap[nx][ny]);
            return false;
        }
        return true;
    }

    function defineBullet(id, displayName, color, vx, vy, speed, tempAdd, breakChance, deleteChance) {
        elements[id] = {
            name: displayName,
            color: color,
            tick: function (pixel) {
                if (!moveLinear(pixel, vx, vy, speed, function (p, target) {
                    heatTarget(target, tempAdd);
                    damageTarget(target, breakChance, deleteChance);
                    deletePixel(p.x, p.y);
                })) {
                    return;
                }
                if (Math.random() < 0.02) { deletePixel(pixel.x, pixel.y); }
            },
            state: "solid",
            category: CATEGORY,
            density: 7800,
            conduct: 0.15,
            excludeRandom: true,
            cooldown: defaultCooldown
        };
    }

    function defineExplosiveProjectile(def) {
        elements[def.id] = {
            name: def.name,
            color: def.color,
            tick: function (pixel) {
                if (pixel.life === undefined) { pixel.life = def.life; }

                if (def.trailChance && Math.random() < def.trailChance) {
                    var tx = pixel.x - def.vx;
                    var ty = pixel.y - def.vy;
                    if (isEmpty(tx, ty)) { createPixel("smoke", tx, ty); }
                }

                if (!moveLinear(pixel, def.vx, def.vy, def.speed, function (p, target) {
                    heatTarget(target, def.impactTemp || 150);
                    damageTarget(target, def.breakChance || 0.2, def.deleteChance || 0.05);
                    explodeAt(p.x, p.y, def.explosionRadius, def.explosionPayload);
                    deletePixel(p.x, p.y);
                })) {
                    return;
                }

                pixel.life--;
                if (pixel.life <= 0) {
                    explodeAt(pixel.x, pixel.y, def.explosionRadius, def.explosionPayload);
                    deletePixel(pixel.x, pixel.y);
                }
            },
            state: "solid",
            category: CATEGORY,
            density: def.density || 1500,
            burn: 100,
            burnTime: 1,
            conduct: 0.35,
            excludeRandom: true,
            cooldown: defaultCooldown
        };
    }

    function defineFlakShell(id, name, color, vx) {
        elements[id] = {
            name: name,
            color: color,
            tick: function (pixel) {
                if (pixel.life === undefined) { pixel.life = 24; }
                if (pixel.climb === undefined) { pixel.climb = 8; }

                var vy = pixel.climb > 0 ? -1 : 0;
                if (pixel.climb > 0) { pixel.climb--; }

                if (!moveLinear(pixel, vx, vy, 2, function (p, target) {
                    heatTarget(target, 180);
                    damageTarget(target, 0.45, 0.15);
                    explodeAt(p.x, p.y, 8, ["wp_flak_shrapnel", "wp_flak_shrapnel", "fire", "smoke"]);
                    deletePixel(p.x, p.y);
                })) {
                    return;
                }

                pixel.life--;
                if (pixel.life < 12 && Math.random() < 0.18) {
                    explodeAt(pixel.x, pixel.y, 8, ["wp_flak_shrapnel", "wp_flak_shrapnel", "smoke", "fire"]);
                    deletePixel(pixel.x, pixel.y);
                    return;
                }
                if (pixel.life <= 0) {
                    explodeAt(pixel.x, pixel.y, 8, ["wp_flak_shrapnel", "wp_flak_shrapnel", "smoke", "fire"]);
                    deletePixel(pixel.x, pixel.y);
                }
            },
            state: "solid",
            category: CATEGORY,
            density: 4200,
            burn: 90,
            burnTime: 2,
            conduct: 0.3,
            excludeRandom: true,
            cooldown: defaultCooldown
        };
    }

    function defineLauncherRight(id, name, color, shotElement, chancePercent) {
        elements[id] = {
            name: name,
            color: color,
            behavior: [
                "XX|XX|XX",
                "XX|XX|CR:" + shotElement + "%" + chancePercent,
                "XX|XX|XX"
            ],
            category: CATEGORY,
            state: "solid",
            density: 7800,
            hardness: 0.9,
            conduct: 1
        };
    }

    function defineLauncherLeft(id, name, color, shotElement, chancePercent) {
        elements[id] = {
            name: name,
            color: color,
            behavior: [
                "XX|XX|XX",
                "CR:" + shotElement + "%" + chancePercent + "|XX|XX",
                "XX|XX|XX"
            ],
            category: CATEGORY,
            state: "solid",
            density: 7800,
            hardness: 0.9,
            conduct: 1
        };
    }

    function defineLauncherUp(id, name, color, shotElement, chancePercent) {
        elements[id] = {
            name: name,
            color: color,
            behavior: [
                "XX|CR:" + shotElement + "%" + chancePercent + "|XX",
                "XX|XX|XX",
                "XX|XX|XX"
            ],
            category: CATEGORY,
            state: "solid",
            density: 7800,
            hardness: 0.9,
            conduct: 1
        };
    }

    elements.wp_ammo_crate = {
        name: "Ammo Crate",
        color: ["#6e5235", "#88663f", "#9d7750"],
        behavior: behaviors.WALL,
        breakInto: [
            "wp_bullet_right", "wp_bullet_left", "wp_bullet_up",
            "wp_ap_round_right", "wp_ap_round_left",
            "wp_he_rocket_right", "wp_he_rocket_left",
            "wp_flak_shell_right", "wp_flak_shell_left",
            "wp_tank_shell_right", "wp_tank_shell_left"
        ],
        burn: 8,
        burnTime: 120,
        burnInto: "explosion",
        category: CATEGORY,
        state: "solid",
        density: 900
    };

    elements.wp_ap_ammo_crate = {
        name: "Armor Piercing Ammo Crate",
        color: ["#4d5d6e", "#61768a", "#748ca3"],
        behavior: behaviors.WALL,
        breakInto: ["wp_ap_round_right", "wp_ap_round_left", "wp_tank_shell_right", "wp_tank_shell_left"],
        burn: 4,
        burnTime: 160,
        burnInto: "explosion",
        category: CATEGORY,
        state: "solid",
        density: 1100
    };

    defineBullet("wp_bullet_right", "Bullet Right", "#5c5b58", 1, 0, 2, 60, 0.2, 0.02);
    defineBullet("wp_bullet_left", "Bullet Left", "#5c5b58", -1, 0, 2, 60, 0.2, 0.02);
    defineBullet("wp_bullet_up", "Bullet Up", "#5c5b58", 0, -1, 2, 60, 0.2, 0.02);

    defineBullet("wp_ap_round_right", "AP Round Right", "#808b99", 1, 0, 3, 260, 0.8, 0.35);
    defineBullet("wp_ap_round_left", "AP Round Left", "#808b99", -1, 0, 3, 260, 0.8, 0.35);

    defineExplosiveProjectile({
        id: "wp_he_rocket_right",
        name: "HE Rocket Right",
        color: ["#6b7378", "#868f95", "#50575d"],
        vx: 1,
        vy: 0,
        speed: 2,
        life: 34,
        trailChance: 0.6,
        impactTemp: 250,
        breakChance: 0.35,
        deleteChance: 0.2,
        explosionRadius: 12,
        explosionPayload: ["fire", "fire", "plasma", "smoke", "metal_scrap"],
        density: 1600
    });

    defineExplosiveProjectile({
        id: "wp_he_rocket_left",
        name: "HE Rocket Left",
        color: ["#6b7378", "#868f95", "#50575d"],
        vx: -1,
        vy: 0,
        speed: 2,
        life: 34,
        trailChance: 0.6,
        impactTemp: 250,
        breakChance: 0.35,
        deleteChance: 0.2,
        explosionRadius: 12,
        explosionPayload: ["fire", "fire", "plasma", "smoke", "metal_scrap"],
        density: 1600
    });

    defineFlakShell("wp_flak_shell_right", "Flak Shell Right", ["#78818a", "#5e6770"], 1);
    defineFlakShell("wp_flak_shell_left", "Flak Shell Left", ["#78818a", "#5e6770"], -1);

    defineExplosiveProjectile({
        id: "wp_tank_shell_right",
        name: "Tank Shell Right",
        color: ["#a59162", "#89744a", "#6f5c3a"],
        vx: 1,
        vy: 0,
        speed: 2,
        life: 26,
        trailChance: 0.25,
        impactTemp: 400,
        breakChance: 0.7,
        deleteChance: 0.35,
        explosionRadius: 14,
        explosionPayload: ["fire", "fire", "fire", "plasma", "smoke", "metal_scrap"],
        density: 5200
    });

    defineExplosiveProjectile({
        id: "wp_tank_shell_left",
        name: "Tank Shell Left",
        color: ["#a59162", "#89744a", "#6f5c3a"],
        vx: -1,
        vy: 0,
        speed: 2,
        life: 26,
        trailChance: 0.25,
        impactTemp: 400,
        breakChance: 0.7,
        deleteChance: 0.35,
        explosionRadius: 14,
        explosionPayload: ["fire", "fire", "fire", "plasma", "smoke", "metal_scrap"],
        density: 5200
    });

    elements.wp_flak_shrapnel = {
        name: "Flak Shrapnel",
        color: ["#c7c7c7", "#9b9b9b", "#6f6f6f"],
        tick: function (pixel) {
            if (pixel.life === undefined) { pixel.life = 12; }
            if (!tryMove(pixel, pixel.x, pixel.y + 1)) {
                tryMove(pixel, pixel.x + (Math.random() < 0.5 ? -1 : 1), pixel.y + 1);
            }
            pixel.life--;
            if (pixel.life <= 0) { deletePixel(pixel.x, pixel.y); }
        },
        state: "solid",
        category: CATEGORY,
        density: 7800,
        burn: 40,
        burnTime: 8,
        burnInto: "fire",
        hidden: true
    };

    defineLauncherRight("wp_machine_gun_right", "Machine Gun Right", "#4f555c", "wp_bullet_right", 45);
    defineLauncherLeft("wp_machine_gun_left", "Machine Gun Left", "#4f555c", "wp_bullet_left", 45);
    defineLauncherUp("wp_machine_gun_up", "Machine Gun Up", "#4f555c", "wp_bullet_up", 45);

    defineLauncherRight("wp_ap_cannon_right", "AP Cannon Right", "#5f6975", "wp_ap_round_right", 18);
    defineLauncherLeft("wp_ap_cannon_left", "AP Cannon Left", "#5f6975", "wp_ap_round_left", 18);

    defineLauncherRight("wp_rocket_launcher_right", "Rocket Launcher Right", "#576066", "wp_he_rocket_right", 6);
    defineLauncherLeft("wp_rocket_launcher_left", "Rocket Launcher Left", "#576066", "wp_he_rocket_left", 6);

    defineLauncherRight("wp_flak_cannon_right", "Flak Cannon Right", "#707982", "wp_flak_shell_right", 8);
    defineLauncherLeft("wp_flak_cannon_left", "Flak Cannon Left", "#707982", "wp_flak_shell_left", 8);

    defineLauncherRight("wp_tank_gun_right", "Tank Gun Right", "#6e664f", "wp_tank_shell_right", 4);
    defineLauncherLeft("wp_tank_gun_left", "Tank Gun Left", "#6e664f", "wp_tank_shell_left", 4);
})();
