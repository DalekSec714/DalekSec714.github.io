// logicpulse.js

let deactivateQueue = [];

elements.logic_pulse = {
	color: "#f62954",
	category: "tools",
	tool: function (pixel) {
		if (pixel.element !== "logic_wire") return;
		if (pixel.lstate === 2) return;

		pixel.lstate = 2;
		deactivateQueue.push({x: pixel.x, y: pixel.y, deactivateAtTick: pixelTicks + 1});
	},
	excludeRandom: true,
};

function deactivateLogicWires() {
	// var s = "";
	// pixelMap[1].slice(1, 9).forEach((e) => {
	// 	s += e.lstate;
	// });
	// console.log(s, deactivateQueue);

	for (let i = deactivateQueue.length - 1; i >= 0; i--) {
		const operation = deactivateQueue[i];
		if (operation.deactivateAtTick >= pixelTicks) continue;

		const pixel = pixelMap[operation.x][operation.y];
		if (!pixel) continue;
		if (pixel.element !== "logic_wire") continue;

		pixel.lstate = -2;

		deactivateQueue.splice(i, 1);
	}
}

runEveryTick(deactivateLogicWires);
runAfterReset(() => {
	deactivateQueue = [];
});
