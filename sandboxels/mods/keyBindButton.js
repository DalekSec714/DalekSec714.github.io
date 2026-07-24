alert(convertToKeyCode("a"))
async function _kBBprompt(message, defaultValue = "") {
    return new Promise(resolve => {
        promptInput(message, (result) => {
            resolve(result);
        }, "keyBindButton.js is asking you...", defaultValue);
        
    })
}
var thisKeyIsPressed = "a";
elements.keyBindButton = {
	color: "#bebfa3",
	onPlace: async (pixel) => {
        var answer1 = await _kBBprompt("Select a key to bind.",(thisKeyIsPressed||undefined))
        if (!answer1) {return}

    },
    tick: (pixel) => {
        if (thisKeyIsPressed){
            alert(convertToKeyCode(thisKeyIsPressed))
        }
    },
	ignore: ["flash"],
	conduct: 1,
	movable: false,
	category:"machines",
	darkText: true,
}
function convertToKeyCode(key) {
    var keyCode = key.value.toUpperCase().charCodeAt(0);
    return keyCode;
}