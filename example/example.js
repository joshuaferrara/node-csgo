var steam = require("steam"),
    util = require("util"),
    fs = require("fs"),
    csgo = require("../"),
    bot = new steam.SteamClient(),
    CSGO = new csgo.CSGOClient(bot, true),
    readlineSync = require("readline-sync");

var onSteamLogOn = function onSteamLogOn(){
        bot.setPersonaState(steam.EPersonaState.Busy);
        util.log("Logged on.");

        util.log("Current SteamID64: " + bot.steamID);
        util.log("Account ID: " + CSGO.ToAccountID(bot.steamID));

        CSGO.launch();
        
        CSGO.on("unhandled", function(message) {
           console.log("Unhandled msg")
           console.log(message);
        });
        
        CSGO.on("ready", function() {
            util.log("node-csgo ready.");

            CSGO.matchmakingStatsRequest()
            CSGO.on("matchmakingStatsData", function(matchmakingStatsResponse) {
                util.log("Avg. Wait Time: " + matchmakingStatsResponse.globalStats.searchTimeAvg);
                util.log("Players Online: " + matchmakingStatsResponse.globalStats.playersOnline);
                util.log("Players Searching: " + matchmakingStatsResponse.globalStats.playersSearching);
                util.log("Servers Online: " + matchmakingStatsResponse.globalStats.serversOnline);
                util.log("Servers Available: " + matchmakingStatsResponse.globalStats.serversAvailable);
                util.log("Matches in Progress: " + matchmakingStatsResponse.globalStats.ongoingMatches);
                console.log(matchmakingStatsResponse);
                
                CSGO.playerProfileRequest(CSGO.ToAccountID("76561197992172465")); //
                CSGO.on("playerProfile", function(profile) {
                   console.log("Profile");
                   console.log(JSON.stringify(profile, null, 2));
                });
                
                CSGO.requestRecentGames(137013074);
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
    },
    onWebSessionID = function onWebSessionID(webSessionID) {
        util.log("Received web session id.");
        // steamTrade.sessionID = webSessionID;
        bot.webLogOn(function onWebLogonSetTradeCookies(cookies) {
            util.log("Received cookies.");
            for (var i = 0; i < cookies.length; i++) {
                // steamTrade.setCookie(cookies[i]);
            }
        });
    };

var username = readlineSync.question('Username: ');
var password = readlineSync.question('Password: ', {noEchoBack: true});
var authCode = readlineSync.question('AuthCode: ');

var logOnDetails = {
    "accountName": username,
    "password": password,
};
if (authCode != "") logOnDetails.authCode = authCode;
var sentry = fs.readFileSync('sentry');
if (sentry.length) logOnDetails.shaSentryfile = sentry;
bot.logOn(logOnDetails);
bot.on("loggedOn", onSteamLogOn)
    .on('sentry', onSteamSentry)
    .on('servers', onSteamServers)
    .on('webSessionID', onWebSessionID);