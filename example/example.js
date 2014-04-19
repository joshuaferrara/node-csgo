var steam = require("steam"),
    util = require("util"),
    fs = require("fs"),
    csgo = require("../"),
    bot = new steam.SteamClient(),
    CSGO = new csgo.CSGOClient(bot, false);

global.config = require("./config");

var onSteamLogOn = function onSteamLogOn(){
        bot.setPersonaState(steam.EPersonaState.Busy); // to display your bot's status as "Busy"
        bot.setPersonaName(config.steam_name); // to change its nickname
        util.log("Logged on.");

        CSGO.launch();
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

var logOnDetails = {
    "accountName": config.steam_user,
    "password": config.steam_pass,
};
if (config.steam_guard_code) logOnDetails.authCode = config.steam_guard_code;
var sentry = fs.readFileSync('sentry');
if (sentry.length) logOnDetails.shaSentryfile = sentry;
bot.logOn(logOnDetails);
bot.on("loggedOn", onSteamLogOn)
    .on('sentry', onSteamSentry)
    .on('servers', onSteamServers)
    .on('webSessionID', onWebSessionID);