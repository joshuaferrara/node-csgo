var steam = require('steam'),
    csgo = require('../'),
    steamClient = new steam.SteamClient(),
    steamUser = new steam.SteamUser(steamClient),
    steamGC = new Steam.SteamGameCoordinator(bot, 730),
    CSGOCli = new csgo.CSGOClient(steamUser, steamGC, false),
    should = require('should');

describe('Steam', () => {
    describe('#connect', () => {
        it('should connect to Steam', (done) => {
            steamClient.connect();
            steamClient.on('connected', () => {
                done();
            });
        });
    });
})