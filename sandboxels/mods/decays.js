function decay(ms) {
return 1/(Math.pow(Math.log10(ms*30+1),2)*10);
}

elements.alpha_particle = {
color: "#ff87fd",
behavior: [
["M1","M1","M1"],
["M1","EX%50:3>electric","M1"],
["M1","M1","M1"],
],
category: "particles",
state: "gas"
},
elements.beta_minus_particle = {
color: "#4338e0",
behavior: [
"M1|M1|M1",
"M1|EX%15:2>electric|M1",
"M1|M1|M1",
],
reactions: {
"beta_plus_particle": {elem1:"gamma_ray", elem2: "gamma_ray"}
},
category: "particles",
state: "gas"
},
elements.electron_antineutrino = {
color: "#877ff0",
behavior: [
"M1|M1|M1",
"M1|XX|M1",
"M1|M1|M1",
],
  reactions: {
"proton": {elem1:"neutron", elem2: "beta_plus_particle"}
},
category: "particles",
state: "gas"
},
elements.beta_plus_particle = {
color: "#e0d838",
behavior: [
"M1|M1|M1",
"M1|EX%15:2>electric|M1",
"M1|M1|M1",
],
category: "particles",
state: "gas"
},
elements.electron_neutrino = {
color: "#d7f27c",
behavior: behaviors.BOUNCY,
category: "particles",
state: "gas"
},
elements.gamma_ray = {
color: "#faf20a",
behavior: behaviors.BOUNCY,
category: "particles",
state: "gas"
},

elements.alpha_generator = {
color: "#5c135b",
behavior: behaviors.WALL,
tick: function(pixel) {
if (Math.random() > 0.995) {
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactivity_generator",
state: "solid"
},
elements.beta_minus_generator = {
color: "#8645ff",
behavior: behaviors.WALL,
tick: function(pixel) {
if (Math.random() > 0.995) {
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactivity_generator",
state: "solid"
},
elements.beta_plus_generator = {
color: "#c7ff45",
behavior: behaviors.WALL,
tick: function(pixel) {
if (Math.random() > 0.995) {
releaseElement(pixel, "beta_plus_particle");
releaseElement(pixel, "electron_neutrino");
}
},
category: "radioactivity_generator",
state: "solid"
},
elements.gamma_generator = {
color: "#f05d02",
behavior: behaviors.WALL,
tick: function(pixel) {
if (Math.random() > 0.995) {
releaseElement(pixel, "gamma_ray");
}
},
category: "radioactivity_generator",
state: "solid"
},

//Thorium series
elements.californium_252 = {
color: "#f013f0",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(2.645*365*24*60*60*1000)) {
changePixel(pixel, "curium_248");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.curium_248 = {
color: "#3e0ecf",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(3.48e5*365*24*60*60*1000)) {
changePixel(pixel, "plutonium_244");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.plutonium_244 = {
color: "#a7a3b5",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(8.13e7*365*24*60*60*1000)) {
if (Math.random() > 7.3e-9*0.01) {
changePixel(pixel, "uranium_240");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "curium_244");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.uranium_240 = {
color: "#06db02",
behavior: behaviors.POWDER,
tick: function(pixel){
if (Math.random() < decay(14.1*60*60*1000)) {
changePixel(pixel, "neptunium_240m");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.neptunium_240m = {
color: "#2e0078",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(7.22*60*1000)) {
if (Math.random() < 0.0012) {
changePixel(pixel, "neptunium_240");
releaseElement(pixel, "gamma_ray");
} else {
changePixel(pixel, "plutonium_240");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.neptunium_240 = {
color: "#2e0078",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(61.9*60*1000)) {
changePixel(pixel, "plutonium_240");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.plutonium_240 = {
color: "#a7a3b5",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(6561*365*24*60*60*1000)) {
if (Math.random() > 1.3e-11*0.01) {
changePixel(pixel, "uranium_236");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "mercury_206");
releaseElement(pixel, "silicon_34");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.uranium_236 = {
color: "#06db02",
behavior: behaviors.POWDER,
tick: function(pixel){
if (Math.random() < decay(2.342e7*365*24*60*60*1000)) {
if (Math.random() > 2e-11*0.01) {
changePixel(pixel, "thorium_232");
releaseElement(pixel, "alpha_particle");
} else {
if (Math.random() < 0.5) {
changePixel(pixel, "mercury_208");
releaseElement(pixel, "magnesium_28");
} else {
changePixel(pixel, "mercury_206");
releaseElement(pixel, "magnesium_30");
}
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.thorium_232 = {
color: "#1de9f0",
behavior: behaviors.POWDER,
tick: function(pixel){
if (Math.random() < decay(1.40e10*365*24*60*60*1000)) {
if (Math.random() > 2.78e-10*0.01) {
changePixel(pixel, "radium_228");
releaseElement(pixel, "alpha_particle");
} else {
if (Math.random() < 0.5) {
changePixel(pixel, "mercury_208");
releaseElement(pixel, "neon_24");
} else {
changePixel(pixel, "mercury_206");
releaseElement(pixel, "neon_26");
}
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.radium_228 = {
color: "#0eed0e",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(5.75*365*24*60*60*1000)) {
changePixel(pixel, "actinium_228");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.actinium_228 = {
color: "#0b8f4b",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(6.15*60*60*1000)) {
changePixel(pixel, "thorium_228");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.thorium_228 = {
color: "#1de9f0",
behavior: behaviors.POWDER,
tick: function(pixel){
if (Math.random() < decay(1.9125*365*24*60*60*1000)) {
if (Math.random() > 1.13e-11*0.01) {
changePixel(pixel, "radium_224");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "lead");
releaseElement(pixel, "oxygen_20");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.radium_224 = {
color: "#0eed0e",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(3.63224*60*60*1000)) {
if (Math.random() > 4e-11) {
changePixel(pixel, "radon_220");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "lead_210");
releaseElement(pixel, "carbon_14");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.radon_220 = {
color: "#7ffa7f",
behavior: behaviors.GAS,
tick: function(pixel) {
if (Math.random() < decay(55.6*1000)) {
changePixel(pixel, "polonium_216");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "gas"
},
elements.polonium_216 = {
color: "#dcf007",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(144)) {
changePixel(pixel, "lead_212");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.lead_212 = {
color: "#9a9a9c",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(10.627*60*60*1000)) {
changePixel(pixel, "bismuth_212");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.bismuth_212 = {
color: "#00ff91",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(60.55*60*1000)) {
if (Math.random() < 0.6405) {
changePixel(pixel, "polonium_212");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
} else {
if (Math.random() < 35.94/(35.94+0.014)) {
changePixel(pixel, "thallium_208");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "lead");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
releaseElement(pixel, "alpha_particle");
}
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.polonium_212 = {
color: "#dcf007",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(294.4/1000000)) {
changePixel(pixel, "lead");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.thallium_208 = {
color: "#26780d",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(3.053*60*1000)) {
changePixel(pixel, "lead");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},


//Actinium series
elements.californium_251 = {
color: "#f013f0",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(900*365*24*60*60*1000)) {
changePixel(pixel, "curium_247");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.curium_247 = {
color: "#3e0ecf",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(1.56e7*365*24*60*60*1000)) {
changePixel(pixel, "plutonium_243");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.plutonium_243 = {
color: "#a7a3b5",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(4.955*60*60*1000)) {
changePixel(pixel, "americium_243");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.americium_243 = {
color: "#f5c9ce",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(7350*365*24*60*60*1000)) {
changePixel(pixel, "neptunium_239");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.neptunium_239 = {
color: "#2e0078",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(2.356*24*60*60*1000)) {
changePixel(pixel, "plutonium_239");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.plutonium_239 = {
color: "#a7a3b5",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(2.411e4*365*24*60*60*1000)) {
changePixel(pixel, "uranium_235");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.uranium_235 = {
color: "#06db02",
behavior: behaviors.POWDER,
tick: function(pixel){
if (Math.random() < decay(7.04e8*365*24*60*60*1000)) {
if (Math.random() > 9.8e-10*0.01) {
changePixel(pixel, "thorium_231");
releaseElement(pixel, "alpha_particle");
} else if (Math.random() > 1.8/9.8) {
if (Math.random() < 0.5) {
changePixel(pixel, "lead_211");
releaseElement(pixel, "neon_24");
} else {
changePixel(pixel, "lead_210");
releaseElement(pixel, "neon_25");
}
} else {
if (Math.random() < 0.5) {
changePixel(pixel, "mercury_207");
releaseElement(pixel, "magnesium_28");
} else {
changePixel(pixel, "mercury_206");
releaseElement(pixel, "magnesium_29");
}
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.thorium_231 = {
color: "#1de9f0",
behavior: behaviors.POWDER,
tick: function(pixel){
if (Math.random() < decay(25.52*60*60*1000)) {
changePixel(pixel, "protactinium_231");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.protactinium_231 = {
color: "#16f582",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(3.27e4*365*24*60*60*1000)) {
if (Math.random() > 1.34e-9*0.01 + 1e-12 * 0.01) {
changePixel(pixel, "actinium_227");
releaseElement(pixel, "alpha_particle");
} else if (Math.random() < 1.34e-9/(1.34e-9+1e-12)) {
changePixel(pixel, "thallium_207");
releaseElement(pixel, "neon_24");
} else {
changePixel(pixel, "lead");
releaseElement(pixel, "fluorine_23");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.actinium_227 = {
color: "#0b8f4b",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(21.772*365*24*60*60*1000)) {
if (Math.random() < 0.9862) {
changePixel(pixel, "thorium_227");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
} else {
changePixel(pixel, "francium_223");
releaseElement(pixel, "alpha_particle");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.thorium_227 = {
color: "#1dd9f0",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(18.693*24*60*60*1000)) {
changePixel(pixel, "radium_223");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.francium_223 = {
color: "#ed370e",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(22*60*1000)) {
if (Math.random() < 0.99994) {
changePixel(pixel, "radium_223");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
} else {
changePixel(pixel, "astatine_219");
releaseElement(pixel, "alpha_particle");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.radium_223 = {
color: "#0eed0e",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(11.435*24*60*60*1000)) {
if (Math.random() > 8.9e-10) {
changePixel(pixel, "radon_219");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "lead_209");
releaseElement(pixel, "carbon_14");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.astatine_219 = {
color: "#57524f",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(56*1000)) {
if (Math.random() < 0.936) {
changePixel(pixel, "bismuth_215");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "radon_219");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.radon_219 = {
color: "#7ffa7f",
behavior: behaviors.GAS,
tick: function(pixel) {
if (Math.random() < decay(3.96*1000)) {
changePixel(pixel, "polonium_215");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "gas"
},
elements.bismuth_215 = {
color: "#00ff91",
behavior: behaviors.POWDER,
tick: function(pixel) {
if(Math.random() < decay(7.6*60*1000)) {
changePixel(pixel, "polonium_215");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.polonium_215 = {
color: "#dcf007",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(1.781)) {
if (Math.random() < 0.9999977) {
changePixel(pixel, "lead_211");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "astatine_215");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.astatine_215 = {
color: "#57524f",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(37/1000)) {
changePixel(pixel, "bismuth_211");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.lead_211 = {
color: "#9a9a9c",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(36.16*60*1000)) {
changePixel(pixel, "bismuth_211");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.bismuth_211 = {
color: "#00ff91",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(2.14*60*1000)) {
if (Math.random() < 0.99724) {
changePixel(pixel, "thallium_207");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "polonium_211");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.thallium_207 = {
color: "#26780d",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(4.77*60*1000)) {
changePixel(pixel, "lead");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.polonium_211 = {
color: "#dcf007",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(516)) {
changePixel(pixel, "lead");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},

//Uranium series
elements.californium_250 = {
color: "#f013f0",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(13.08*365*24*60*60*1000)) {
changePixel(pixel, "curium_246");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.curium_246 = {
color: "#3e0ecf",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(4760*365*24*60*60*1000)) {
changePixel(pixel, "plutonium_242");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.plutonium_242 = {
color: "#a7a3b5",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(3.75e5*365*24*60*60*1000)) {
changePixel(pixel, "uranium_238");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.uranium_238 = {
color: "#06db02",
behavior: behaviors.POWDER,
tick: function(pixel){
if (Math.random() < decay(4.463e9*365*24*60*60*1000)) {
if (Math.random() > 2.2e-10 * 0.01) {
changePixel(pixel, "thorium_234");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "plutonium_238");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.thorium_234 = {
color: "#1de9f0",
behavior: behaviors.POWDER,
tick: function(pixel){
if (Math.random() < decay(24.11*24*60*60*1000)) {
changePixel(pixel, "protactinium_234m");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.protactinium_234m = {
color: "#16f582",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(1.16*60*1000)) {
if (Math.random() < 0.0016) {
changePixel(pixel, "protactinium_234");
releaseElement(pixel, "gamma_ray");
} else {
changePixel(pixel, "uranium_234");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.protactinium_234 = {
color: "#16f582",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(6.7*60*60*1000)) {
changePixel(pixel, "uranium_234");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.uranium_234 = {
color: "#06db02",
behavior: behaviors.POWDER,
tick: function(pixel){
if (Math.random() < decay(2.455e5*365*24*60*60*1000)) {
if (Math.random() > 2.3e-11 * 0.01) {
changePixel(pixel, "thorium_230");
releaseElement(pixel, "alpha_particle");
} else if (Math.random < 1.4/2.3) {
changePixel(pixel, "mercury_206");
releaseElement(pixel, "magnesium_28");
} else {
if (Math.random() < 0.5) {
changePixel(pixel, "lead_210");
releaseElement(pixel, "neon_24");
} else {
changePixel(pixel, "lead");
releaseElement(pixel, "neon_26");
}
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.thorium_230 = {
color: "#1de9f0",
behavior: behaviors.POWDER,
tick: function(pixel){
if (Math.random() < decay(7.45e4*365*24*60*60*1000)) {
if (Math.random() > 5.8e-11*0.01) {
changePixel(pixel, "radium_226");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "mercury_206");
releaseElement(pixel, "neon_24");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.radium_226 = {
color: "#0eed0e",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(1600*365*24*60*60*1000)) {
if (Math.random() > 2.6e-11) {
changePixel(pixel, "radon_222");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "lead_212");
releaseElement(pixel, "carbon_14");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.radon_222 = {
color: "#7ffa7f",
behavior: behaviors.GAS,
tick: function(pixel) {
if (Math.random() < decay(3.8215*24*60*60*1000)) {
changePixel(pixel, "polonium_218");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "gas"
},
elements.polonium_218 = {
color: "#dcf007",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(3.097*60*1000)) {
if (Math.random() < 0.9998) {
changePixel(pixel, "lead_214");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "astatine_218");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.astatine_218 = {
color: "#57524f",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(1.28*1000)) {
if (Math.random() < 0.9999) {
changePixel(pixel, "bismuth_214");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "radon_218");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.radon_218 = {
color: "#7ffa7f",
behavior: behaviors.GAS,
tick: function(pixel) {
if (Math.random() < decay(33.75)) {
changePixel(pixel, "polonium_214");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "gas"
},
elements.lead_214 = {
color: "#9a9a9c",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(27.06*60*1000)) {
changePixel(pixel, "bismuth_214");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.bismuth_214 = {
color: "#00ff91",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(19.9*60*1000)) {
if (Math.random() < 0.99979) {
changePixel(pixel, "polonium_214");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
} else {
if (Math.random() < 7/8) {
changePixel(pixel, "thallium_210");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "lead_210");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
releaseElement(pixel, "alpha_particle");
}
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.polonium_214 = {
color: "#dcf007",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(0.1635)) {
changePixel(pixel, "lead_210");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.thallium_210 = {
color: "#26780d",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(1.30*60*1000)) {
if (Math.random() > 0.00009) {
changePixel(pixel, "lead_210");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
} else {
changePixel(pixel, "lead_209"); //this goes with the Np series which is later
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
releaseElement(pixel, "neutron");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.lead_210 = {
color: "#9a9a9c",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(22.2*365*24*60*60*1000)) {
if (Math.random() > 1.9e-6*0.01) {
changePixel(pixel, "bismuth_210");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
} else {
changePixel(pixel, "mercury_206");
releaseElement(pixel, "alpha_particle");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.bismuth_210 = {
color: "#00ff91",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(5.012*24*60*60*1000)) {
if (Math.random() > 1.32e-4*0.01) {
changePixel(pixel, "polonium_210");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
} else {
changePixel(pixel, "thallium_206");
releaseElement(pixel, "alpha_particle");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.polonium_210 = {
color: "#dcf007",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(138.376*24*60*60*1000)) {
changePixel(pixel, "lead");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.mercury_206 = {
color: "#c2bcbc",
behavior: behaviors.LIQUID,
tick: function(pixel) {
if (Math.random() < decay(8.32*60*1000)) {
changePixel(pixel, "thallium_206");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "liquid"
},
elements.thallium_206 = {
color: "#26780d",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(4.20*60*1000)) {
changePixel(pixel, "lead");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},

//Neptunium series
elements.californium_249 = {
color: "#f013f0",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(351*365*24*60*60*1000)) {
changePixel(pixel, "curium_245");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.curium_245 = {
color: "#3e0ecf",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(8250*365*24*60*60*1000)) {
changePixel(pixel, "plutonium_241");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.plutonium_241 = {
color: "#a7a3b5",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(14.33*365*24*60*60*1000)) {
if (Math.random() < 0.999975) {
changePixel(pixel, "americium_241");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
} else {
changePixel(pixel, "uranium_237");
releaseElement(pixel, "alpha_particle");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.americium_241 = {
color: "#f5c9ce",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(432.6*365*24*60*60*1000)) {
changePixel(pixel, "neptunium_237");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.uranium_237 = {
color: "#06db02",
behavior: behaviors.POWDER,
tick: function(pixel){
if (Math.random() < decay(6.752*24*60*60*1000)) {
changePixel(pixel, "neptunium_237");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.neptunium_237 = {
color: "#2e0078",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(2.144e6*365*24*60*60*1000)) {
if (Math.random() > 4e-12*0.01) {
changePixel(pixel, "protactinium_233");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "thallium_207");
releaseElement(pixel, "magnesium_30");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.protactinium_233 = {
color: "#16f582",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(26.98*24*60*60*1000)) {
changePixel(pixel, "uranium_233");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.uranium_233 = {
color: "#06db02",
behavior: behaviors.POWDER,
tick: function(pixel){
if (Math.random() < decay(1.592e5*365*24*60*60*1000)) {
if (Math.random() > 7.2e-11 * 0.01) {
changePixel(pixel, "thorium_229");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "lead_209");
releaseElement(pixel, "neon_24");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.thorium_229 = {
color: "#1dd9f0",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(7920*365*24*60*60*1000)) {
changePixel(pixel, "radium_225");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.radium_225 = {
color: "#0eed0e",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(14.8*24*60*60*1000)) {
if (Math.random() < 0.999974) {
changePixel(pixel, "actinium_225");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
} else {
changePixel(pixel, "radon_221");
releaseElement(pixel, "alpha_particle");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.actinium_225 = {
color: "#0b8f4b",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(9.919*24*60*60*1000)) {
if (Math.random() > 5.3e-10*0.01) {
changePixel(pixel, "francium_221");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "bismuth_211");
releaseElement(pixel, "carbon_14");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.radon_221 = {
color: "#7ffa7f",
behavior: behaviors.GAS,
tick: function(pixel) {
if (Math.random() < decay(25.7*60*1000)) {
if (Math.random() < 0.78) {
changePixel(pixel, "francium_221");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
} else {
changePixel(pixel, "polonium_217");
releaseElement(pixel, "alpha_particle");
}
}
},
category: "radioactive_main",
state: "gas"
},
elements.francium_221 = {
color: "#ed370e",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(4.801*60*1000)) {
if (Math.random() > 0.0048*0.01+8.8e-13) {
changePixel(pixel, "astatine_217");
releaseElement(pixel, "alpha_particle");
} else if (Math.random() < 0.0048/(0.0048+8.8e-11)) {
changePixel(pixel, "radium_221");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
} else {
changePixel(pixel, "thallium_207");
releaseElement(pixel, "carbon_14");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.radium_221 = {
color: "#0eed0e",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(25*1000)) {
if (Math.random() > 1.2e-12) {
changePixel(pixel, "radon_217");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "lead");
releaseElement(pixel, "carbon_14");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.polonium_217 = {
color: "#dcf007",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(1.53*1000)) {
if (Math.random() < 0.975) {
changePixel(pixel, "lead_213");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "astatine_217");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.astatine_217 = {
color: "#57524f",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(32.6)) {
if (Math.random() < 0.99992) {
changePixel(pixel, "bismuth_213");
releaseElement(pixel, "alpha_particle");
} else {
changePixel(pixel, "radon_217");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.radon_217 = {
color: "#7ffa7f",
behavior: behaviors.GAS,
tick: function(pixel) {
if (Math.random() < decay(0.590)) {
changePixel(pixel, "polonium_213");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "gas"
},
elements.lead_213 = {
color: "#9a9a9c",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(10.2*60*1000)) {
changePixel(pixel, "bismuth_213");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.bismuth_213 = {
color: "#00ff91",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(45.6*60*1000)) {
if (Math.random() < 0.9791) {
changePixel(pixel, "polonium_213");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
} else {
changePixel(pixel, "thallium_209");
releaseElement(pixel, "alpha_particle");
}
}
},
category: "radioactive_main",
state: "solid"
},
elements.polonium_213 = {
color: "#dcf007",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(3.705/1000)) {
changePixel(pixel, "lead_209");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.thallium_209 = {
color: "#26780d",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(2.162*60*1000)) {
changePixel(pixel, "lead_209");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.lead_209 = {
color: "#9a9a9c",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(3.235*60*60*1000)) {
changePixel(pixel, "bismuth_209");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "solid"
},
elements.bismuth_209 = {
color: "#00ff91",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(2.01e19*365*24*60*60*1000)) {
changePixel(pixel, "thallium");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_main",
state: "solid"
},
elements.thallium = {
color: "#26780d",
behavior: behaviors.WALL,
category: "solids",
state: "solid"
},

//other stuff
elements.silicon_34 = {
color: "#dce8fc",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(2.77*1000)) {
changePixel(pixel, "phosphorus_34");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_other",
state: "solid"
},
elements.phosphorus_34 = {
color: "#ff4782",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(12.43*1000)) {
changePixel(pixel, "sulfur");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_other",
state: "solid"
},
elements.curium_244 = {
color: "#3e0ecf",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(18.11*365*24*60*60*1000)) {
changePixel(pixel, "plutonium_240");
releaseElement(pixel, "alpha_particle");
}
},
category: "radioactive_other",
state: "solid"
},
elements.magnesium_30 = {
color: "#faedd4",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(317)) {
if (Math.random() < 0.9994) {
changePixel(pixel, "aluminium_30");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
} else {
changePixel(pixel, "aluminium_29");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
releaseElement(pixel, "neutron");
}
}
},
category: "radioactive_other",
state: "solid"
},
elements.aluminium_30 = {
color: "#dbdbdb",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(3.62*1000)) {
changePixel(pixel, "silicon");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_other",
state: "solid"
},
elements.aluminium_29 = {
color: "#dbdbdb",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(6.56*60*1000)) {
changePixel(pixel, "silicon");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_other",
state: "solid"
},
elements.silicon = {
color: "#dce8fc",
behavior: behaviors.POWDER,
category: "powders",
state: "solid"
},
elements.mercury_208 = {
color: "#c2bcbc",
behavior: behaviors.LIQUID,
tick: function(pixel) {
if (Math.random() < decay(135*1000)) {
changePixel(pixel, "thallium_208");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "liquid"
},
elements.magnesium_28 = {
color: "#faedd4",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(20.915*60*60*1000)) {
changePixel(pixel, "aluminium_28");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_other",
state: "solid"
},
elements.aluminium_28 = {
color: "#dbdbdb",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(2.245*60*1000)) {
changePixel(pixel, "silicon");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_other",
state: "solid"
},
elements.neon_24 = {
color: "#ff3c26",
behavior: behaviors.GAS,
tick: function(pixel) {
if (Math.random() < decay(3.38*60*1000)) {
changePixel(pixel, "sodium_24");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_other",
state: "gas"
},
elements.sodium_24 = {
color: "#cfcdcc",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(14.9560*60*60*1000)) {
changePixel(pixel, "magnesium");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_other",
state: "solid"
},
elements.neon_25 = {
color: "#ff3c26",
behavior: behaviors.GAS,
tick: function(pixel) {
if (Math.random() < decay(3.38*60*1000)) {
changePixel(pixel, "sodium_25");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_other",
state: "gas"
},
elements.sodium_25 = {
color: "#cfcdcc",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(59.1*1000)) {
changePixel(pixel, "magnesium");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_other",
state: "solid"
},
elements.mercury_207 = {
color: "#c2bcbc",
behavior: behaviors.LIQUID,
tick: function(pixel) {
if (Math.random() < decay(2.9*60*1000)) {
changePixel(pixel, "thallium_207");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_main",
state: "liquid"
},
elements.magnesium_29 = {
color: "#faedd4",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(1.30*1000)) {
changePixel(pixel, "aluminium_29");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_other",
state: "solid"
},
elements.plutonium_238 = {
color: "#a7a3b5",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(87.7*365*24*60*60*1000)) {
if (Math.random() > 2e-14 * 0.01) {
changePixel(pixel, "uranium_234");
releaseElement(pixel, "alpha_particle");
} else if (Math.random() > 0.6/2) {
changePixel(pixel, "mercury_206");
releaseElement(pixel, "silicon_32");
} else {
if (Math.random () > 0.5) {
changePixel(pixel, "lead_210");
releaseElement(pixel, "magnesium_28");
} else {
changePixel(pixel, "lead");
releaseElement(pixel, "magnesium_30");
}
}
}
},
category: "radioactive_other",
state: "solid"
},
elements.silicon_32 = {
color: "#dce8fc",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(157*365*24*60*60*1000)) {
changePixel(pixel, "phosphorus_32");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_other",
state: "solid"
},
elements.phosphorus_32 = {
color: "#ff4782",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(14.269*24*60*60*1000)) {
changePixel(pixel, "sulfur");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_other",
state: "solid"
},
elements.neon_26 = {
color: "#ff3c26",
behavior: behaviors.GAS,
tick: function(pixel) {
if (Math.random() < decay(197)) {
if (Math.random() > 0.9987) {
changePixel(pixel, "sodium_25");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
releaseElement(pixel, "neutron");
} else {
changePixel(pixel, "sodium_26");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
}
},
category: "radioactive_other",
state: "gas"
},
elements.sodium_26 = {
color: "#cfcdcc",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(1.07128*1000)) {
changePixel(pixel, "magnesium");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_other",
state: "solid"
},
elements.fluorine_23 = {
color: "#b0ff1c",
behavior: behaviors.GAS,
tick: function(pixel) {
if (Math.random() < decay(2.23*1000)) {
if (Math.random() < 0.86) {
changePixel(pixel, "neon_23");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
} else {
changePixel(pixel, "neon");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
releaseElement(pixel, "neutron");
}
}
},
category: "radioactive_other",
state: "gas"
},
elements.neon_23 = {
color: "#ff3c26",
behavior: behaviors.GAS,
tick: function(pixel) {
if (Math.random() < decay(37.15*1000)) {
changePixel(pixel, "sodium");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_other",
state: "gas"
},
elements.oxygen_20 = {
color: "#7bc7c6",
behavior: behaviors.GAS,
tick: function(pixel) {
if (Math.random() < decay(13.51*1000)) {
changePixel(pixel, "fluorine_20");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_other",
state: "gas"
},
elements.fluorine_20 = {
color: "#b0ff1c",
behavior: behaviors.GAS,
tick: function(pixel) {
if (Math.random() < decay(11.0062*1000)) {
changePixel(pixel, "neon");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_other",
state: "gas"
},
elements.carbon_14 = {
color: "#2e3030",
behavior: behaviors.POWDER,
tick: function(pixel) {
if (Math.random() < decay(5.70e3*365*24*60*60*1000)) {
changePixel(pixel, "nitrogen");
releaseElement(pixel, "beta_minus_particle");
releaseElement(pixel, "electron_antineutrino");
}
},
category: "radioactive_other",
state: "solid"
}
