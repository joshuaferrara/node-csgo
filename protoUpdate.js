var https = require("https");
var fs = require("fs");
var url = require("url");
var path = require("path");

var protos = [
	"https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/Protobufs/base_gcmessages.proto",
	"https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/Protobufs/cstrike15_gcmessages.proto",
	"https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/Protobufs/engine_gcmessages.proto",
	"https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/Protobufs/gcsdk_gcmessages.proto",
	"https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/Protobufs/steammessages.proto",
	"https://raw.githubusercontent.com/SteamRE/SteamKit/master/Resources/Protobufs/steamclient/steammessages_clientserver.proto",
	"https://raw.githubusercontent.com/SteamRE/SteamKit/master/Resources/Protobufs/steamclient/steammessages_clientserver_2.proto",
	"https://raw.githubusercontent.com/SteamRE/SteamKit/master/Resources/Protobufs/steamclient/steammessages_base.proto",
	"https://raw.githubusercontent.com/SteamRE/SteamKit/master/Resources/Protobufs/steamclient/encrypted_app_ticket.proto"
];

function download(downloadUrl) {
	var fileName = path.basename(url.parse(downloadUrl).pathname);

	console.log("\tDownloading " + fileName);
	var file = fs.createWriteStream(__dirname + "/protos/" + fileName);
	var request = https.get(downloadUrl, function(response) {
	  response.pipe(file);
	});
}

console.log("Updating protobufs...");

var oldProtos = fs.readdirSync(__dirname + "/protos/");
oldProtos.forEach(function(fileName) {
	if (fileName.indexOf(".proto") != -1) {
		console.log("\tRemoving old protobuf file: " + fileName);
		fs.unlinkSync(__dirname + "/protos/" + fileName);
	}
});

protos.forEach(function(url) {
	download(url);
});

console.log("Update complete!");
