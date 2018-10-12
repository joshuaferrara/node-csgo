var Steam = require('steam'),
    CSGO = require('../'),
    steamClient = new Steam.SteamClient(),
    steamUser = new Steam.SteamUser(steamClient),
    steamGC = new Steam.SteamGameCoordinator(steamUser, 730),
    CSGOCli = new CSGO.CSGOClient(steamUser, steamGC, false),
    should = require('should'),
    crypto = require('crypto');

function MakeSha(bytes) {
    var hash = crypto.createHash('sha1');
    hash.update(bytes);
    return hash.digest();
}

Steam.servers = require('../example/servers.json');

var connectedToSteam = false;
function beConnectedToSteam(done) {
    if (connectedToSteam) return done();
    setTimeout(() => beConnectedToSteam(done), 1000);
}

describe('Steam', () => {
    // timeout(20000);

    describe('#connect', () => {
        it('should connect to Steam', (done) => {
            steamClient.connect();
            steamClient.on('connected', () => {
                done();
            });
        });
    });

    describe('#login', () => {
        it('should login to Steam', (done) => {
            before(beConnectedToSteam);

            steamUser.logOn({
                "account_name": process.env.steam_username,
                "password": process.env.steam_password,
                "sha_sentryfile": MakeSha(Buffer.from(process.env.steam_sentry, 'base64')),
            });

            steamClient.on('logOnResponse', (resp) => {
                if (resp.eresult == Steam.EResult.OK) {
                    loggedInToSteam = true;
                    done();
                } else {
                    console.error('Failed to log on to Steam.');
                    console.error(resp);
                }
            });
        });
    });
})