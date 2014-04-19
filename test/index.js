var steam = require("steam"),
    util = require("util"),
    fs = require("fs"),
    csgo = require("../"),
    bot = new steam.SteamClient(),
    CSGO = new csgo.CSGOClient(bot, true);

global.config = require("./config");

/* Steam logic */
var onSteamLogOn = function onSteamLogOn(){
        bot.setPersonaState(steam.EPersonaState.Busy); // to display your bot's status as "Online"
        bot.setPersonaName(config.steam_name); // to change its nickname
        util.log("Logged on.");

        CSGO.launch();
        CSGO.on("ready", function() {
            console.log("Node-csgo ready.");

            function requestData() {
                CSGO.matchmakingStatsRequest();
                setTimeout(requestData, 5000);
            }
            requestData();
            
            CSGO.on("matchmakingStatsData", function(matchmakingStatsResponse) {
                //console.log(JSON.stringify(matchmakingStatsResponse, null, 2));
                console.log("Avg. Wait Time: " + matchmakingStatsResponse.globalStats.searchTimeAvg);
            });
        });

        CSGO.on("unready", function onUnready(){
            console.log("Node-csgo unready.");
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

// Login, only passing authCode if it exists
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
