
/* Setup */
function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

window._standaloneMessages = {};

function titleCase(string) {
	string = string.replace(/_./g, function (match) {return match.toUpperCase();}).replace(/_/g, ' ');
	return string.charAt(0).toUpperCase() + string.slice(1);
}

window.standaloneMessageHandlers = {
	usingDiscord: function(data) {
		if (window.usingDiscord) return;
		window.usingDiscord = true;
	}
}

window.addEventListener('message', event => {
	const data = event.data;

	if (data.myTypeField === 'response-from-main') {
		console.log('Got response from main process:', data.data);
		if (data.data.error) {
			logMessage("ERROR: "+(data.data.message || "Unknown error occurred"))
		}
		else if (data.data.request) {
			if (data.data.request.id && _standaloneMessages[data.data.request.id]) {
				_standaloneMessages[data.data.request.id](data.data);
			}
		}
	}
	else if (data.myTypeField === 'message-to-client') {
		console.log("Got message from main process:",data)
		let type = data.data.type;
		if (standaloneMessageHandlers[type]) {
			standaloneMessageHandlers[type](data.data);
		}
	}

});

window.standaloneSend = async function(type, data, callback) {
	const id = uuidv4();
	_standaloneMessages[id] = callback;
	window.postMessage({
		myTypeField: 'my-custom-message',
		data: data,
		type: type,
		id: id
	});
}

saveTagsMap["1"] = "Structure/City";
saveTagsMap["2"] = "Natural/Landscape";
saveTagsMap["3"] = "Machine";
saveTagsMap["4"] = "Destroyable";
saveTagsMap["5"] = "Art";
saveTagsMap["6"] = "Cooking/Food";
saveTagsMap["7"] = "Experiment";
saveTagsMap["8"] = "Weapon";
saveTagsMap["9"] = "Workstation";
saveTagsMap["10"] = "Holiday";
saveTagsMap["11"] = "Modded";
saveTagsMap["12"] = "Challenge";
saveTagsMap["13"] = "Contest";
saveTagsMap["14"] = "Contest Submission";
saveTagsMap["15"] = "Miscellaneous";
saveTagsMap["90"] = "Official";

/* Example */
/*
standaloneSend("get-workshop",{value: "test"});
*/





/* Functionality */

// Set default author name from Steam
if (!settings.authorName) {
	standaloneSend("username", {}, (res) => {
		settings.authorName = res.value;
	});
}

// standaloneSend("getWorkshop", { page:1 }, (res) => {
// 	console.log(res.value)
// });
// standaloneSend("getWorkshopOwned", {}, (res) => {
// 	console.log(res.value)
// });

// standaloneSend("downloadWorkshop", { itemid:3512989509n }, (res) => {
// 	console.log(res.value)
// });
// standaloneSend("showWebpage", { url:"https://steamcommunity.com/workshop/browse/?appid=3664820" } );

// standaloneSend("installInfo", { itemid:3512989509n }, (res) => {
// 	console.log(res.value)
// });

// standaloneSend("getWorkshopFile", { workshopID:3512989509n, filename:"stomach man.sbxls" }, (res) => {
// 	console.log(res.value)
// });

// standaloneSend("username", {}, (res) => {
// 	console.log("USERNAME IS " + res.value);
// });




// Move localStorage saves to files
if (!settings.transferredSaves) {
	Object.keys(localStorage).forEach((key) => {
		if (key.startsWith("SandboxelsSaves/")) {
			// let slot = parseInt(key.split("SandboxelsSaves/")[1]);
		
			let json = JSON.parse(localStorage.getItem(key));
			standaloneSend("writeSave",{json:json});
		}
	})
	settings.transferredSaves = true;
	saveSettings();
}

// Save file management

window.addEventListener("load",() => {
	document.getElementById("saveSlotList").innerText = "Loading save files...";
	document.getElementById("savesTabLocal").addEventListener("click", ()=>{
		window.showSaves();
	});
	document.getElementById("savesTabWorkshop").style.display = "";
	document.getElementById("savesTabWorkshop").innerText = "Workshop";
	document.getElementById("savesTabLocal").after(document.getElementById("savesTabWorkshop"));
	document.querySelector("div.menuTab[data-tab=workshop]").addEventListener("scroll", window.handleWorkshopScroll);
	document.querySelector("div.menuTab[data-tab=workshop] .menuTopBar").style.display = "flex";
	document.getElementById("saveTagsSpan").style.display = "block";
	document.getElementById("saveWorkshopList").innerText = "Loading saves...";
	document.getElementById("savesOpenWorkshop").style.display = "block";
	document.getElementById("savesGetOnSteam").style.display = "none";

	const btn = document.getElementById("clearSaves");
	btn.id = "openFolder";
	btn.value = "Open Data Folder";
	btn.onclick = () => {
		standaloneSend("openFolder")
	}

	const workshopSearch = document.getElementById("workshopSearch");
	workshopSearch.oninput = workshopSearchChange;

	const workshopFilter = document.getElementById("workshopFilter");
	for (let tagID in saveTags) {
		workshopFilter.insertAdjacentHTML("beforeend",
			`<option value="${tagID}">${saveTags[tagID]}</option>`
		);
	}
	workshopFilter.onchange = showWorkshopSaves;

	// Discord activity lines
	let elementActivities = {
		unknown: "Waiting...",
		heat: "Heating up pixels",
		cool: "Cooling down pixels",
		erase: "Erasing pixels",
		drag: "Dragging pixels",
		pick: "Picking an element",
		mix: "Mixing pixels",
		lookup: "Learning about elements",
		shock: "Electrocuting pixels",
		paint: "Painting with pixels",
		smash: "Breaking pixels",
		cook: "Cooking a meal",
		incinerate: "Vaporizing pixels",
		random: "Placing random pixels",
		image: "Placing images",
		unpaint: "Removing Paint",
		uncharge: "Removing Charge",
		unburn: "Extinguishing Fire",
		debug: "Debugging",
		prop: "Setting pixel properties",

		water: "Watering",
		grass: "Touching Grass",
		fire: "Playing with Fire",
		plasma: "Vaporizing with Plasma",
		cold_fire: "Freezing with Fire",
		laser: "Firing their laser",
		radiation: "Radiating",
		neutron: "Bombarding with Neutrons",
		proton: "Bombarding with Protons",
		electric: "Electrocuting pixels",
		lightning: "Striking with Lightning",
		bless: "Performing miracles",
		god_ray: "Performing miracles",
		heat_ray: "Heating up pixels",
		freeze_ray: "Cooling down pixels",
		explosion: "Exploding pixels",
		sugar: "Sweetening with Sugar",
		honey: "Sweetening with Honey",
		molasses: "Flooding with Molasses",
		udder: "Milking Udders",
		bomb: "Bombing pixels",
		firework: "Lighting Fireworks",
		nuke: "Nuking the canvas",
		n_explosion: "Nuking the canvas",
		h_bomb: "Crying baby VS Hydrogen Bomb",
		dirty_bomb: "Radiating the canvas",
		blaster: "Blasting the canvas",
		tnt: "Placing TNT",
		c4: "Placing C4",
		portal_in: "Thinking with Portals",
		portal_out: "Thinking with Portals",
		midas_touch: "Turning pixels to Gold",
		sun: "Shining Sun",
		art: "Drawing pixel art",
		poison: "Poisoning pixels",
		poison_gas: "Poisoning pixels",
		plague: "Infecting pixels",
		primordial_soup: "Creating life",
		petal: "Scattering Petals",
		confetti: "Scattering Confetti",
		human: "Tormenting Humans",
	}
	for (let key in elementActivities) {
		if (elements[key]) elements[key].activity = elementActivities[key]
	}
	elementActivities = undefined;

	// document.querySelectorAll('input[type="text"], input[type="number"]').forEach((e) => {
	// 	e.addEventListener("focus", (el) => {
	// 		standaloneSend("openKeyboard", {
	// 			desc: el.target.getAttribute("title"),
	// 			text: el.target.value
	// 		}, (res) => {});
	// 	});
	// })


})

window.showSaves = function showSaves(skip) {
	var savesParent = document.getElementById("savesParent");
	var saveSlotList = document.getElementById("saveSlotList");
	saveSlotList.innerText = "Loading save files...";

	if (!skip) {
		standaloneSend("getSaves", {}, (res) => {
			let saveItems = [];
			res.value.forEach((item) => {
				saveItems.push({
					name: item.file.replace(/\.\w+$/,""),
					filename: item.file,
					time: item.time,
					localFile: true,
					published: item.published,
					workshop: item.workshop,
					url: item.workshop ? "https://steamcommunity.com/sharedfiles/filedetails/?id="+item.workshop : undefined
				})
			})
			displaySavesList("saveSlotList", saveItems, true);
	
			standaloneSend("getWorkshopOwned", {}, (res) => {
				displaySavesList("saveSlotList", res.value);
			})
	
		});
	}
	
	savesParent.style.display = "block";
	showingMenu = "saves";
}

window.loadSaveFile = function(filename) {
	promptText("Please hold :)",undefined,"Loading Save...");
	standaloneSend("getSave", { name:filename }, (res) => {
		let json = res.value;
		lastSaveJSON = json;
		loadSave(json);
		currentSaveData.filename = filename;
	})
	closeMenu();
}

window.writeSaveFile = function(json) {
	if (json.meta && json.meta.name) currentSaveData.filename = json.meta.name + ".sbxls";
	standaloneSend("writeSave", { json:json });
}

window.overwriteSaveFile = function(filename) {
	savingState = {overwrite:filename};
	document.getElementById("saveName").value = filename.replace(/\.(sbxls|json)$/,"");
	showSavePrompt();
}

window.overwriteSaveFileConfirm = function(filename,json) {
	standaloneSend("overwriteSave", { json:json, name:filename });
}

window.deleteSaveFile = function(filename) {
	promptConfirm("Are you sure you want to DELETE "+filename+"? This cannot be undone.",
		(r) => {
			if (r) standaloneSend("deleteSave", { name:filename }, (res) => {
				showSaves();
			});
			else showSaves();
		},
		"Delete Save",
		true
	)
}

window.loadWorkshop = function(workshopID, filename) {
	promptText("Please hold :)",undefined,"Loading Save...");
	standaloneSend("getWorkshopFile", { workshopID:workshopID, filename:filename }, (res) => {
		let json = res.value;
		lastSaveJSON = json;
		loadSave(json);
		currentSaveData.filename = filename;
		currentSaveData.workshop = workshopID;
	})
}

window.deleteWorkshop = function(workshopID, filename) {
	promptText("Please hold :)",undefined,"Unsubscribing...");
	standaloneSend("deleteWorkshopFile", { workshopID:workshopID, filename:filename }, (res) => {
		if (showingMenu) showSaves();
	})
	closeMenu();
}

window.workshopSearchTimeout = null;

window.workshopSearchChange = function() {
	if (workshopSearchTimeout) clearTimeout(workshopSearchTimeout);

	workshopSearchTimeout = setTimeout(workshopSearchComplete, 500);
}
window.workshopSearchComplete = function() {
	showWorkshopSaves();
}

window.isLoadingWorkshop = false;
window.showWorkshopSaves = function() {
	window.isLoadingWorkshop = true;
	const saveWorkshopList = document.getElementById("saveWorkshopList");
	const workshopSearch = document.getElementById("workshopSearch");
	let search = workshopSearch.value.trim() || undefined;
	const workshopFilter = document.getElementById("workshopFilter");
	let tag = parseInt(workshopFilter.value) || undefined;
	let page = 1;
	saveWorkshopList.setAttribute("data-page",page.toString());

	var saveItems = [];

	standaloneSend("getWorkshop", {page:page, search:search, tag:tag}, (res) => {
		if (res.done) return;

		res.value.items.forEach((item) => {
			if (item.banned) return;
			// console.log(item);
			saveItems.push({
				name: item.title,
				time: (item.timeUpdated || item.timeCreated) * 1000,
				image: item.previewUrl,
				desc: item.description,
				// tags: (item.tags && item.tags[0]) ? item.tags : undefined,
				modded: item.tags && item.tags.includes("Modded"),
				workshop: item.publishedFileId,
				url: "https://steamcommunity.com/sharedfiles/filedetails/?id="+item.publishedFileId
			})
		})

		displaySavesList("saveWorkshopList", saveItems, true);
		window.isLoadingWorkshop = false;
	})
}

window.handleWorkshopScroll = function(e) {
	let elem = e.target;
	if (elem.scrollTop >= (elem.scrollHeight - elem.offsetHeight - 100)) {
		if (window.isLoadingWorkshop) return;
		window.isLoadingWorkshop = true;

		const saveWorkshopList = document.getElementById("saveWorkshopList");
		const workshopSearch = document.getElementById("workshopSearch");
		let search = workshopSearch.value.trim() || undefined;
		const workshopFilter = document.getElementById("workshopFilter");
		let tag = parseInt(workshopFilter.value) || undefined;
		let page = parseInt(saveWorkshopList.getAttribute("data-page")) + 1;
		saveWorkshopList.setAttribute("data-page",page.toString());

		var saveItems = [];

		standaloneSend("getWorkshop", {page:page, search:search, tag:tag}, (res) => {
			if (res.done) return;

			res.value.items.forEach((item) => {
				if (item.banned) return;
				saveItems.push({
					name: item.title,
					time: (item.timeUpdated || item.timeCreated) * 1000,
					image: item.previewUrl,
					desc: item.description,
					tags: (item.tags && item.tags[0]) ? item.tags : undefined,
					workshop: item.publishedFileId,
					url: "https://steamcommunity.com/sharedfiles/filedetails/?id="+item.publishedFileId
				})
			})

			displaySavesList("saveWorkshopList", saveItems);
			window.isLoadingWorkshop = false;
		})
	}
}

window.openWorkshopPopup = function() {
	standaloneSend("showWebpage", { url:"https://steamcommunity.com/workshop/browse/?appid=3664820" } );
}

window.downloadWorkshop = function(workshopID) {
	standaloneSend("downloadWorkshop", { workshopID:workshopID })
}
window.viewWorkshop = function(workshopID) {
	standaloneSend("showWebpage", { url:"https://steamcommunity.com/sharedfiles/filedetails/?id="+workshopID } );
}

window.handleWorkshopAddClick = function(elem) {
	downloadWorkshop(elem.getAttribute('data-workshop'));
	elem.innerText=langKey('gui.saves.added','Added');
}

window.publishSaveFile = function(filename) {
	promptConfirm("Are you sure you want to publicly publish '"+filename+"' to the Steam Workshop? Everyone will be able to see and download it.\n\nBe sure to save changes before publishing!",
		(r) => {
			if (r) publishSaveFileConfirm(filename);
		},
		"Publish"
	)
}

window.publishSaveFileConfirm = function(filename) {
	// generate screenshot
	// pass filename, png to standaloneSend

	promptText("Publishing...", undefined, "Please hold :)");

	let png = generateScreenshot();
	standaloneSend("publishWorkshopFile", { filename:filename, png:png, workshopID:null }, (res) => {
		promptText("'"+filename+"' was published to the Steam Workshop.", ()=>{
			window.showSaves();
		}, "Published")
	});
}

window.unpublishSaveFile = function(filename, workshopID) {
	promptConfirm("Are you sure you want to remove '"+filename+"' from the Steam Workshop? It will still be available on your device.",
		(r) => {
			if (r) unpublishSaveFileConfirm(filename, workshopID);
		},
		"UnPublish",
		true
	)
}

window.unpublishSaveFileConfirm = function(filename, workshopID) {
	promptText("UnPublishing...", undefined, "Please hold :)");

	standaloneSend("unpublishWorkshopFile", {filename:filename, workshopID:workshopID }, (res) => {
		promptText("'"+filename+"' was unlisted from the Steam Workshop.", ()=>{
			window.showSaves();
		}, "UnPublished")
	})
}

window.republishSaveFile = function(filename, workshopID) {
	promptText("RePublishing...", undefined, "Please hold :)");

	let png = generateScreenshot();
	standaloneSend("publishWorkshopFile", { filename:filename, png:png, workshopID:BigInt(workshopID) }, (res) => {
		promptText("'"+filename+"' was updated on the Steam Workshop.", ()=>{
			window.showSaves();
		}, "RePublished")
	});
}

window.mustBeLoaded = function(verb) {
	promptText("A save must be loaded to "+verb+".", () => {
		showSaves();
	}, "Not Loaded")
}



/* Discord RPC */
window.usingDiscord = false;

/* Rich Presence Activites */
setInterval(function(){
	let line = "";
	let states = [];

	let info = elements[currentElement];

	if (showingMenu) {
		switch (showingMenu) {
			case "info":
				const element = document.getElementById("infoSearch").value;
				line = "Learning about " + (element ? titleCase(element.toLowerCase()) : "elements" );
				break;
			case "saves": 
				line = "Browsing " + (document.getElementById("savesTabWorkshop").classList.contains("selected") ? "the Workshop" : " saves")
				break
			case "mods": 
				line = "Managing mods"
				break
			case "settings": 
				line = "Changing settings"
				break
		
			default:
				break;
		}
	}
	else if (info.activity === null) {}
	else if (info.activity) {
		line = info.activity;
	}
	else {
		if (info.tool && !info.canPlace) {
			line = "Using ";
		}
		else line = "Placing ";
		line += titleCase(info.name || currentElement);
	}

	if (Array.isArray(line)) line = choose(line);

	if (currentSaveData.workshop && currentSaveData.filename) states.push("["+currentSaveData.filename.replace(/\.\w+$/,"")+"]")
	else if (settings.worldgen && settings.worldgen !== "off") states.push("["+titleCase(settings.worldgen)+"]");
	if (paused) states.push("Paused");
	else if (settings.events) states.push("Random events");
	states.push(currentPixels.length + " pixels")
	let state = states.join(" • ");
	
	let activity = {
		currentElement: currentElement,
		line: line,
		state: state
	}
	standaloneSend("activityUpdate", {
		activity: activity
	})
}, 10e3)