elements.polvilho = {
    color: "#f5f5f5",
    behavior: behaviors.POWDER,
    category: "food",
    state: "solid",
    density: 500,
    reactions: {
        "water": { elem1: "massa_polvilho" }
    }
};

elements.massa_polvilho = {
    color: "#fff0cc",
    behavior: behaviors.STICKY,
    category: "food",
    state: "solid",
    tempHigh: 200,
    stateHigh: "pao_de_queijo"
};

elements.pao_de_queijo = {
    color: "#d9a066",
    behavior: behaviors.SOLID,
    category: "food",
    state: "solid",
    density: 700
};

elements.gelatina = {
    color: "#ff4da6",
    behavior: behaviors.LIQUID,
    category: "food",
    viscosity: 5000,
    tempLow: 10,
    stateLow: "gelatina_firme"
};

elements.gelatina_firme = {
    color: "#ff66b3",
    behavior: behaviors.SOLID,
    category: "food",
    tempHigh: 20,
    stateHigh: "gelatina"
};

elements.misturador = {
    color: "#555555",
    category: "machines",
    behavior: behaviors.WALL,
    tick: function(pixel) {

        let neighbors = [];

        // pega vizinhos
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {

                let x = pixel.x + dx;
                let y = pixel.y + dy;

                if (!isEmpty(x,y,true)) {
                    let p = pixelMap[x][y];
                    if (p.element !== "misturador") {
                        neighbors.push(p);
                    }
                }
            }
        }

        // mistura aleatoriamente posições
        for (let i = 0; i < neighbors.length; i++) {
            let p1 = neighbors[i];
            let p2 = neighbors[Math.floor(Math.random()*neighbors.length)];

            if (p1 && p2 && p1 !== p2) {
                let tempX = p1.x;
                let tempY = p1.y;

                tryMove(p1, p2.x, p2.y);
                tryMove(p2, tempX, tempY);
            }
        }
    }
};

elements.maquina_de_cafe = {
    color: "#333333",
    category: "machines",
    behavior: behaviors.WALL,
    conduct: 1, // aceita eletricidade

    tick: function(pixel) {

        // verifica se está energizada
        if (pixel.charge > 0) {

            let x = pixel.x;
            let y = pixel.y + 1;

            // espaço embaixo
            if (isEmpty(x, y)) {

                // chance de sair café
                if (Math.random() < 0.3) {
                    createPixel("coffee", x, y);
                }
            }
        }
    }
};

let teclaÇ_pressionada = false;

document.addEventListener("keydown", function(ç) {
    if (ç.key.toLowerCase() === "ç") {
        teclaÇ_pressionada = true;
    }
});

document.addEventListener("keyup", function(ç) {
    if (ç.key.toLowerCase() === "ç") {
        teclaÇ_pressionada = false;
    }
});

elements.botao_eletrico = {
    color: "#ffcc00",
    category: "machines",
    behavior: behaviors.WALL,
    conduct: 1,

    tick: function(pixel) {

        // só ativa se tecla Ç estiver pressionada
        if (teclaÇ_pressionada) {

            // verifica se o mouse está em cima do pixel
            if (pixel.x === mousePos.x && pixel.y === mousePos.y) {

                pixel.charge = 1;

                let coords = [
                    [0,1],[1,0],[-1,0],[0,-1]
                ];

                coords.forEach(c => {
                    let x = pixel.x + c[0];
                    let y = pixel.y + c[1];

                    if (!isEmpty(x,y,true)) {
                        let p = pixelMap[x][y];
                        if (elements[p.element].conduct) {
                            p.charge = 1;
                        }
                    }
                });
            }
        }
    }
};

elements.maquina_inteligente = {
    color: "#0099cc",
    category: "machines",
    behavior: behaviors.WALL,
    conduct: 1,

    tick: function(pixel) {

        if (pixel.charge > 0) {

            let vizinhos = {
                cima: null,
                baixo: null,
                esquerda: null,
                direita: null
            };

            // pegar vizinhos
            if (!isEmpty(pixel.x, pixel.y - 1, true)) {
                vizinhos.cima = pixelMap[pixel.x][pixel.y - 1];
            }

            if (!isEmpty(pixel.x, pixel.y + 1, true)) {
                vizinhos.baixo = pixelMap[pixel.x][pixel.y + 1];
            }

            if (!isEmpty(pixel.x - 1, pixel.y, true)) {
                vizinhos.esquerda = pixelMap[pixel.x - 1][pixel.y];
            }

            if (!isEmpty(pixel.x + 1, pixel.y, true)) {
                vizinhos.direita = pixelMap[pixel.x + 1][pixel.y];
            }

            // 🧠 LÓGICA INTELIGENTE

            // receita: água + polvilho → massa
            if (
                vizinhos.esquerda && vizinhos.esquerda.element === "water" &&
                vizinhos.direita && vizinhos.direita.element === "polvilho"
            ) {
                changePixel(vizinhos.esquerda, "massa_polvilho");
                deletePixel(vizinhos.direita.x, vizinhos.direita.y);
            }

            // receita: massa + calor (cima) → pão
            if (
                vizinhos.baixo && vizinhos.baixo.element === "massa_polvilho" &&
                vizinhos.cima && vizinhos.cima.temp > 100
            ) {
                changePixel(vizinhos.baixo, "pao_de_queijo");
            }

            // receita: gelatina + frio (lado) → firme
            if (
                vizinhos.baixo && vizinhos.baixo.element === "gelatina" &&
                vizinhos.esquerda && vizinhos.esquerda.temp < 5
            ) {
                changePixel(vizinhos.baixo, "gelatina_firme");
            }
        }
    }
};




