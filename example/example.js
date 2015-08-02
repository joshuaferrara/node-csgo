var Steam = require("steam"),
    util = require("util"),
    fs = require("fs"),
    csgo = require("../"),
    bot = new Steam.SteamClient(),
    steamUser = new Steam.SteamUser(bot),
    steamFriends = new Steam.SteamFriends(bot),
    steamGC = new Steam.SteamGameCoordinator(bot, 730);
    CSGO = new csgo.CSGOClient(steamUser, steamGC, false),
    readlineSync = require("readline-sync"),
    crypto = require("crypto");

function MakeSha(bytes) {
    var hash = crypto.createHash('sha1');
    hash.update(bytes);
    return hash.digest();
}


var onSteamLogOn = function onSteamLogOn(response){
        if (response.eresult == Steam.EResult.OK) {
            util.log('Logged in!');
        }
        else
        {
            util.log('error, ', response);
            process.exit();
        }
        steamFriends.setPersonaState(Steam.EPersonaState.Busy);
        util.log("Logged on.");

        util.log("Current SteamID64: " + bot.steamID);
        util.log("Account ID: " + CSGO.ToAccountID(bot.steamID));

        CSGO.launch();

        CSGO.on("unhandled", function(message) {
            util.log("Unhandled msg");
            util.log(message);
        });

        CSGO.on("ready", function() {
            util.log("node-csgo ready.");

            CSGO.matchmakingStatsRequest();
            CSGO.on("matchmakingStatsData", function(matchmakingStatsResponse) {
                util.log("Avg. Wait Time: " + matchmakingStatsResponse.global_stats.search_time_avg);
                util.log("Players Online: " + matchmakingStatsResponse.global_stats.players_online);
                util.log("Players Searching: " + matchmakingStatsResponse.global_stats.players_searching);
                util.log("Servers Online: " + matchmakingStatsResponse.global_stats.servers_online);
                util.log("Servers Available: " + matchmakingStatsResponse.global_stats.servers_available);
                util.log("Matches in Progress: " + matchmakingStatsResponse.global_stats.ongoing_matches);
                console.log(JSON.stringify(matchmakingStatsResponse, null, 4));

                CSGO.playerProfileRequest(CSGO.ToAccountID(bot.steamID)); //
                CSGO.on("playerProfile", function(profile) {
                   console.log("Profile");
                   console.log(JSON.stringify(profile, null, 2));
                });

                CSGO.requestRecentGames(CSGO.ToAccountID(bot.steamID));
                CSGO.on("matchList", function(list) {
                   console.log("Match List");
                   console.log(JSON.stringify(list, null, 2));
                });
            });
        });

        CSGO.on("unready", function onUnready(){
            util.log("node-csgo unready.");
        });

        CSGO.on("unhandled", function(kMsg) {
            util.log("UNHANDLED MESSAGE " + kMsg);
        });
    },
    onSteamSentry = function onSteamSentry(sentry) {
        util.log("Received sentry.");
        require('fs').writeFileSync('sentry', sentry);
    },
    onSteamServers = function onSteamServers(servers) {
        util.log("Received servers.");
        fs.writeFile('servers', JSON.stringify(servers));
    }

var username = readlineSync.question('Username: ');
var password = readlineSync.question('Password: ', {noEchoBack: true});
var authCode = readlineSync.question('AuthCode: ');

var logOnDetails = {
    "account_name": username,
    "password": password,
};
if (authCode !== "") {
    logOnDetails.auth_code = authCode;
}
var sentry = fs.readFileSync('sentry');
if (sentry.length) {
    logOnDetails.sha_sentryfile = MakeSha(sentry);
}
bot.connect();
steamUser.on('updateMachineAuth', function(response, callback){
    fs.writeFileSync('sentry', response.bytes);
    callback({ sha_file: MakeSha(response.bytes) });
});
bot.on("logOnResponse", onSteamLogOn)
    .on('sentry', onSteamSentry)
    .on('servers', onSteamServers)
    .on('connected', function(){
        steamUser.logOn(logOnDetails);
    });