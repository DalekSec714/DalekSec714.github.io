const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { shell } = require('electron');
const path = require("path");
const os = require('os');
const fs = require('fs');
const child_process = require('child_process');
const discordRPC = require('discord-rpc');


const useSteam = true;
const steamAppID = 3664820;
const useDiscord = true;
const startTimestamp = new Date();



const currentOS = process.platform;
let appdata = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
let gameDirPath = path.join(appdata, "sandboxels");

initialData = {};

if (!fs.existsSync(gameDirPath)){
    fs.mkdirSync(gameDirPath);
}
/*
OS X - '/Users/user/Library/Preferences/sandboxels'
Windows 8 - 'C:\Users\user\AppData\Roaming\sandboxels'
Windows XP - 'C:\Documents and Settings\user\Application Data\sandboxels'
Linux - '/home/user/.local/share/sandboxels'
*/

const gameDir = {
	write: async (filename, content) => {
		const filepath = path.join(gameDirPath, filename);
		fs.writeFile(filepath, content, err => {
			if (err) gameDir.error(err);
			else {}
		});
	},
	writeSync: (filename, content) => {
		const filepath = path.join(gameDirPath, filename);

		try {
			fs.writeFileSync(filepath, content); 
		}
		catch (err) {
			gameDir.error(err);
		}
	},
	addDir: (dirname) => {
		const dirpath = path.join(gameDirPath, dirname);
		try {
			if (!fs.existsSync(dirpath)){
				fs.mkdirSync(dirpath);
			}
		}
		catch (err) {
			gameDir.error(err);
		}
	},
	read: (filename) => {
		const filepath = path.join(gameDirPath, filename);
		try {
			return fs.readFileSync(filepath, 'utf8');
		}
		catch (err) {
			gameDir.error(err);
		}
	},
	exists: (filename) => {
		const dirpath = path.join(gameDirPath, filename);
		return fs.existsSync(dirpath);
	},
	delete: (filename) => {
		const filepath = path.join(gameDirPath, filename);
		try {
			fs.unlinkSync(filepath);
		}
		catch (err) {
			console.log(err)
			gameDir.error(err);
		}
	},
	list: (dirname) => {
		let dirpath = gameDirPath;
		if (dirname) dirpath = path.join(gameDirPath, dirname);
		return fs.readdirSync(dirpath);
	},
	rename: (filename, newname) => {
		const filepath = path.join(gameDirPath, filename);
		const newpath = path.join(gameDirPath, newname);
		fs.renameSync(filepath, newpath);
	},

	error: (err) => {
		// send error message to client
	}
}

// gameDir.write("test.txt","success!");
// gameDir.addDir("two");
// gameDir.write("two/hello.txt","yay!");

gameDir.addDir("saves");

if (gameDir.exists("tmp")) {
	let tmpFiles = gameDir.list("tmp");
	tmpFiles.forEach((file) => {
		gameDir.delete(path.join("tmp",file));
	})
}
else {
	gameDir.addDir("tmp");
}

if (gameDir.exists("saves_meta.json")) {
	// check for deleted saves
	let saveFiles = gameDir.list("saves");
	let meta = JSON.parse(gameDir.read("saves_meta.json"));
	let changed = false;
	for (let i = 0; i < meta.length; i++) {
		const item = meta[i];
		if (saveFiles.indexOf(item.file) === -1) {
			meta.splice(i, 1);
			changed = true;
		}
	}
	if (changed) {
		gameDir.writeSync("saves_meta.json",JSON.stringify(meta));
	}
}
else {
	gameDir.writeSync("saves_meta.json","[]");
}

if (gameDir.exists("mods")) {
	initialData.modScripts = {};
	let modFiles = gameDir.list("mods");
	modFiles.forEach((file) => {
		initialData.modScripts[file] = gameDir.read(path.join("mods", file));
	})
}
else {
	gameDir.addDir("mods");
}





let steamAppDir;
let workshopDir;
let steamworks;
let steamclient;
let steamdeck = false;

if (useSteam) {
	steamworks = require("steamworks.js");
	
	// steamclient = steamworks.init(480);
	steamclient = steamworks.init(steamAppID);

	steamdeck = steamclient.utils.isSteamRunningOnSteamDeck();
	console.log("SteamDeck: "+steamdeck);
	
	// console.log("steamworks, ", steamworks)
	
	// console.log("client", steamclient)
	// console.log(steamclient.localplayer.getName())
	// // /!\ Those 3 lines are important for Steam compatibility!
	app.commandLine.appendSwitch("in-process-gpu")
	app.commandLine.appendSwitch("disable-direct-composition")
	app.allowRendererProcessReuse = false;

	steamAppDir = steamclient.apps.appInstallDir(3664820);
	console.log(steamAppDir);
	if (!gameDir.exists("workshop_meta.json")) {
		gameDir.writeSync("workshop_meta.json","{}");
	}
	workshopDir = path.join(steamAppDir, "..", "..", "workshop", "content", steamAppID.toString());
	console.log(workshopDir);

	steamclient.localplayer.setRichPresence("steam_display", "#Activity");

	let steamLang = {
		"english": "en",
		"spanish": "es",
		"french": "fr",
		"german": "de",
		"czech": "cs",
		"finnish": "fi",
		"hungarian": "hu",
		"indonesian": "id",
		"italian": "it",
		"koreana": "ko",
		"polish": "pl",
		"brazilian": "pt_br",
		"russian": "ru",
		"turkish": "tr",
		"vietnamese": "vi",
		"schinese": "zh_cn",
		"tchinese": "zh_hant",
		// "dutch": "nl",
		// "ukrainian": "uk",
	}[steamclient.apps.currentGameLanguage()];

	if (steamLang) initialData.langCode = steamLang;



}



let discordSdk;
let discordReady = false;
let usingRPC = false;
let currentActivity = {};

if (useDiscord) {
	const clientId = '1360770918732796117';
	const scopes = ['rpc', 'rpc.api', 'messages.read'];

	const rpc = new discordRPC.Client({ transport: 'ipc' });

	async function setActivity() {
		if (!rpc || !mainWindow) {
			return;
		}

		standaloneSend("usingDiscord");

		// largeImageKey and smallImageKey assets are uploaded to https://discord.com/developers/applications/<application_id>/rich-presence/assets
		rpc.setActivity({
			details: currentActivity.line || undefined,
			state: currentActivity.state || undefined,
			startTimestamp,
			// largeImageKey: '',
			// largeImageText: '',
			// smallImageKey: '',
			// smallImageText: '',
			instance: false,
			buttons: [{
				label: 'Play Sandboxels',
				url: 'https://sandboxels.r74n.com/'
			}]  
		});
	}

	rpc.on('ready', () => {
		usingRPC = true;
		console.log(rpc.application)

		setActivity();

		// activity can only be set every 15 seconds
		setInterval(() => {
			setActivity();
		}, 15e3);
	});

	rpc.on('error', () => {
		console.log("Couldn't connect to Discord (Not running?)")
	});

	rpc.login({ clientId }).catch(() => {
		console.log("Couldn't connect to Discord (Not running?)")
	});
}

// console.log(steamclient);





let mainWindow;

const createWindow = () => {
	mainWindow = new BrowserWindow({
	width: 800,
	height: 600,
	show: false,
	fullscreenable: true,
	autoHideMenuBar: true,
	webPreferences: {
		preload: path.join(__dirname, 'preload.js'),
		// /!\ Those two options are needed for Steamworks to behave
		nodeIntegration: false,
		contextIsolation: false,
	},
	});
	// try {mainWindow.setMenuBarVisibility(false)}
	// catch {}

	mainWindow.maximize();
	mainWindow.show();

	mainWindow.loadFile('index.html');

	mainWindow.on('closed', () => {
	mainWindow = null;	// Reset mainWindow when the window is fully closed
	});

	mainWindow.webContents.on('before-input-event', (_, input) => {
	if (input.type === 'keyDown' && input.key === 'F12') {
		mainWindow.webContents.toggleDevTools();
	}
	});

	mainWindow.webContents.on('will-navigate', (event, url) => {
	// Prevent navigating to a different site within the app
	if (url !== mainWindow.webContents.getURL()) {
		event.preventDefault();
		shell.openExternal(url);
	}
	});
	
	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
	// Handle window.open or target="_blank"
	shell.openExternal(url);
	return { action: 'deny' };
	});

	return mainWindow;
};

app.on('window-all-closed', () => {
	if (useSteam) {
		steamclient.input.shutdown();
	}
	// Quit the app when all windows are closed
	app.quit();
});

app.on('activate', () => {
	// Re-create a window in the app when the dock icon is clicked in macOS
	if (BrowserWindow.getAllWindows().length === 0) {
		if (!mainWindow) createWindow();
	}
});

// Menu.setApplicationMenu(null);

app.whenReady().then(() => {
	if (!mainWindow) createWindow();

	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
	require('electron').shell.openExternal(url);
	return { action: 'deny' };
	});

	// Handle CMD+Q or manual quit properly
	app.on('before-quit', () => {
	if (process.platform === 'darwin') {
		mainWindow = null; // Ensure the app is closed properly
	}
	});
});

function sanitizeFilename(name) {
	return name.trim().replace(/[\/\\:\*\?"<>\|]|^\.\./g,"_");
}

function writeSave(json, overwrite, rename) {
	let meta = JSON.parse(gameDir.read("saves_meta.json"));

	let name = "Unnamed";
	let newMeta = {};
	if (json.meta) {
		name = json.meta.name;
		
		newMeta.time = json.meta.updated;
	}
	else {
		newMeta.time = Date.now();
	}

	name = sanitizeFilename(name);

	// (handle duplicate filenames)
	if (!overwrite && gameDir.exists(path.join("saves",name+".sbxls"))) {
		let n = 2;
		let done = false;
		while (!done) {
			if (gameDir.exists(path.join("saves",name+" ("+n+").sbxls"))) {
				n++;
				continue;
			}
			done = true;
		}

		name += " ("+n+")";

		if (json.meta) {
			json.meta.name = name;
		}
	}

	name += ".sbxls";
	newMeta.file = name;

	if (overwrite) {
		for (let i = 0; i < meta.length; i++) {
			const oldItem = meta[i];
			if (oldItem.file == newMeta.file) {
				meta.splice(i, 1);
				break;
			}
		}
	}

	gameDir.writeSync(path.join("saves",name), JSON.stringify(json));
	
	if (rename) {
		// (handle duplicate filenames)
		if (!overwrite && gameDir.exists(path.join("saves",rename+".sbxls"))) {
			let n = 2;
			let done = false;
			while (!done) {
				if (gameDir.exists(path.join("saves",rename+" ("+n+").sbxls"))) {
					n++;
					continue;
				}
				done = true;
			}

			rename += " ("+n+")";

			if (json.meta) {
				json.meta.name = rename;
			}
		}

		rename += ".sbxls";
		newMeta.file = rename;

		gameDir.rename(path.join("saves",name), path.join("saves",rename))
	}

	meta.unshift(newMeta);

	gameDir.writeSync("saves_meta.json", JSON.stringify(meta));
}

saveTagsMap = {
	"1": "Structure/City",
	"2": "Natural/Landscape",
	"3": "Machine",
	"4": "Destroyable",
	"5": "Art",
	"6": "Cooking/Food",
	"7": "Experiment",
	"8": "Weapon",
	"9": "Workstation",
	"10": "Holiday",
	"11": "Modded",
	"12": "Challenge",
	"13": "Contest",
	"14": "Contest Submission",
	"15": "Miscellaneous",
	"90": "Official"
}

function standaloneSend(type, data) {
	console.log(type,data)
	mainWindow.webContents.send('message-to-client', {type:type, data: data});
}

messageTypeHandlers = {
	writeSave: (req,res) => {
		// new save file each time, not overwriting
		let json = req.json;
		writeSave(json);
	},
	overwriteSave: (req,res) => {
		let json = req.json;
		let rename;
		if (json.meta) {
			rename = json.meta.name;
			json.meta.name = req.name.replace(/\.(sbxls|json)$/,"");
		}
		writeSave(json,true,rename);
	},
	getSaves: (req,res) => {
		let meta = JSON.parse(gameDir.read("saves_meta.json"));

		let metaMap = {};
		meta.forEach((item) => {
			metaMap[item.file] = true;
		})

		let added = false;
		gameDir.list("saves").forEach((file) => {
			if (!metaMap[file] && (file.includes(".sbxls") || file.includes(".json"))) {
				added = true;
				meta.push({file:file});
			}
		})

		res.value = meta;

		if (added) {
			gameDir.writeSync("saves_meta.json", JSON.stringify(meta));
		}
	},
	getSave: (req,res) => {
		let name = req.name;
		if (name.indexOf(".sbxls") === -1 && name.indexOf(".json") === -1) {
			name += ".sbxls";
		}

		res.value = JSON.parse(gameDir.read(path.join("saves",name)));
	},
	deleteSave: (req,res) => {
		let meta = JSON.parse(gameDir.read("saves_meta.json"));

		for (let i = 0; i < meta.length; i++) {
			const oldItem = meta[i];
			if (oldItem.file == req.name) {
				meta.splice(i, 1);
				break;
			}
		}

		gameDir.delete(path.join("saves",req.name))

		gameDir.writeSync("saves_meta.json", JSON.stringify(meta));
	},

	username: async (req,res) => {
		res.value = steamclient.localplayer.getName();
	},
	getWorkshop: async (req,res) => {
		let tag;
		if (req.tag) {
			if (saveTagsMap[req.tag]) tag = saveTagsMap[req.tag];
		}

		try {
			res.value = await steamclient.workshop.getAllItems(
				req.page||1,
				0,
				0,
				steamAppID,
				steamAppID,
				{
					searchText: req.search,
					requiredTags: tag ? [tag] : undefined,
					excludedTags: tag ? undefined : [saveTagsMap[11]] //exclude Modded saves if no tag
				}
			);
		}
		catch {
			res.done = true;
		}
		// for (let i = 0; i < 10; i++) {
		// 	res.value.items.push(res.value.items[0]);
		// }
	},
	getWorkshopOwned: async (req,res) => {
		let items = [];

		let meta = JSON.parse(gameDir.read("workshop_meta.json"));
		let metaChanged = false;

		if (fs.existsSync(workshopDir)) {
			let files = fs.readdirSync(workshopDir, {
				recursive: true
			});
			files.forEach((file) => {
				if (file.match(/\.(sbxls|json)/g)) {
					const id = BigInt(file.match(/\d+/g)[0]);
					const filename = file.match(/[\/\\].+/g)[0].substring(1);
					let item = {
						workshop: id,
						filename: filename,
						name: filename.replace(/\.(sbxls|json)$/g,""),
						localFile: true,
						url: "https://steamcommunity.com/sharedfiles/filedetails/?id="+id
					};
					if (!meta[id]) {
						let json;
						try {
							json = JSON.parse(fs.readFileSync(path.join(workshopDir, file)));
						}
						catch {}
						if (json && json.meta) {
							meta[id] = {
								file: filename,
								time: json.meta.updated || json.meta.created,
								author: json.meta.author
							};
							metaChanged = true;
						}
					}
					if (meta[id]) {
						item.time = meta[id].time;
						item.author = meta[id].author;
					}
					items.push(item)
				}
			})
		}

		if (metaChanged) {
			gameDir.writeSync("workshop_meta.json",JSON.stringify(meta));
		}

		res.value = items;

		// res.value = await steamclient.workshop.getSubscribedItems();
	},
	downloadWorkshop: async (req,res) => {
		res.value = await steamclient.workshop.download(BigInt(req.workshopID), true);
	},
	getWorkshopFile: async (req,res) => {
		let id = req.workshopID;
		let filename = req.filename;
		let filepath = path.join(workshopDir, id.toString(), filename);
		if (fs.existsSync(filepath)) {
			res.value = JSON.parse(fs.readFileSync(filepath));
		}
		else {
			res.error = true;
			res.message = "Workshop file '"+filename+"' cannot be found";
		}
	},
	deleteWorkshopFile: async (req,res) => {
		let id = req.workshopID;
		let filename = req.filename;
		let filepath = path.join(workshopDir, id.toString(), filename);
		if (fs.existsSync(filepath)) {
			fs.unlinkSync(filepath);
		}
		steamclient.workshop.unsubscribe(BigInt(id));

		let meta = JSON.parse(gameDir.read("workshop_meta.json"));
		delete meta[id];
		gameDir.writeSync("workshop_meta.json",JSON.stringify(meta));
	},
	publishWorkshopFile: async (req,res) => {
		let filename = req.filename;
		let png = req.png;

		let json = JSON.parse(gameDir.read(path.join("saves",filename)));
		if (!json.meta) json.meta = {};

		let workshopID = req.workshopID;
		if (workshopID) workshopID = BigInt(workshopID);

		let tags = [];
		if (json.meta.tags) {
			json.meta.tags.forEach((tagID) => {
				tagID = parseInt(tagID);
				if (tagID === 11) return; //Modded
				tags.push(saveTagsMap[tagID]);
			})
		}
		if (tags.length === 0) {
			tags.push(saveTagsMap[15]); //Miscellaneous
		}
		if (json.saveConfig && json.saveConfig.mods && json.saveConfig.mods.length) {
			tags.push(saveTagsMap[11]); //Modded
		}

		if (!req.workshopID) {
			// create item
			let data = await steamclient.workshop.createItem(steamAppID);
			console.log(data);
			if (data.itemId) {
				workshopID = data.itemId;
			}
			else {
				res.error = true;
				if (data.needsToAcceptAgreement) res.message = "User must accept Steam Workshop agreement";
				else res.message = "Error occurred while creating Workshop item";
				return;
			}
		}

		let timestamp = (Date.now()).toString();

		// save screenshot
		// console.log(png)
		if (png) {
			png = png.replace(/^data:image\/\w+;base64,/, "");
			const buf = Buffer.from(png, "base64");
			await gameDir.write(path.join("tmp",timestamp+".png"), buf);
		}

		// update item
		let r = await steamclient.workshop.updateItem(workshopID, {
			title: json.meta.name || filename.replace(/\.\w+$/,"") || "Untitled",
		    description: json.meta.desc || "",
			tags: tags,
		    visibility: 0,
		    previewPath: png ? path.join(gameDirPath, "tmp", timestamp+".png") : undefined,
		    contentPath: path.join(gameDirPath, "saves", filename),
		});

		console.log(r);

		// (Date.now()).png

		let meta = JSON.parse(gameDir.read("saves_meta.json"));
		
		// set meta
		// .published = true;
		// .workshop = workshopID.toString();
		for (let i = 0; i < meta.length; i++) {
			const oldItem = meta[i];
			if (oldItem.file == filename) {
				oldItem.published = true;
				oldItem.workshop = workshopID.toString();
				gameDir.writeSync("saves_meta.json", JSON.stringify(meta));
				break;
			}
		}
	},
	unpublishWorkshopFile: async(req,res) => {
		let filename = req.filename;
		let workshopID = BigInt(req.workshopID);

		// set visibility to 2 (Private)
		let r = await steamclient.workshop.updateItem(workshopID, {
		    visibility: 2
		});
		console.log(r);

		let meta = JSON.parse(gameDir.read("saves_meta.json"));

		for (let i = 0; i < meta.length; i++) {
			const oldItem = meta[i];
			if (oldItem.file == filename) {
				delete oldItem.published;
				delete oldItem.workshop;
				gameDir.writeSync("saves_meta.json", JSON.stringify(meta));
				break;
			}
		}
	},

	showWebpage: async(req,res) => {
		let url = req.url;
		steamclient.overlay.activateToWebPage(url);
	},
	openFolder: async(req,res) => {
		let command = '';
		switch (process.platform) {
			case 'darwin':
			command = 'open';
			break;
			case 'win32':
			command = 'explorer';
			break;
			default:
			command = 'xdg-open';
			break;
		}
		console.log('child_process.execSync', `${command} "${gameDirPath}"`);
		return child_process.execSync(`${command} "${gameDirPath}"`);
	},

	activityUpdate: async(req,res) => {
		currentActivity = req.activity;

		if (useSteam) {
			steamclient.localplayer.setRichPresence("activity", currentActivity.line + " • " + currentActivity.state);
			steamclient.localplayer.setRichPresence("status", currentActivity.line + " • " + currentActivity.state);
			// console.log(currentActivity);
		}
	},

	openKeyboard: async(req,res) => {
		if (useSteam && steamdeck) {
			steamclient.utils.showGamepadTextInput(0, 0, req.desc || "", 1000, req.text || undefined);
		}
	}


	// installInfo: async (req,res) => {
	// 	res.value = await steamclient.workshop.installInfo(req.itemid);
	// 	let path = res.value.folder;
	// },
	
}

ipcMain.on('custom-message', async (event, message) => {
	// console.log('got an IPC message', event, message);
	let response;
	let request = message.data;

	response = {
		request: {
			type: message.type,
			data: request,
			id: message.id
		}
	};

	if (messageTypeHandlers[message.type]) {
		try {
			await messageTypeHandlers[message.type](request,response);
		}
		catch (e) {
			response.error = true;
			response.message = ""+e;
		}
	}
	else {
		response.error = true;
		response.message = "Invalid message type";
	}

	// console.log(request);

	event.reply("ok", response)
});

ipcMain.handle('fetch-initial-data', () => initialData);

// mainWindow.webContents.send('custom-message', {'SAVED': 'File Saved'});

// ipc.on("send-command", event => {
//	 let response;

//	 response = 123;

//	 event.sender.send("ok", response);
// });

if (useSteam) {
	steamworks.electronEnableSteamOverlay();
}