var Steam = require('steam'),
    CSGO = require('../'),
    steamClient = new Steam.SteamClient(),
    steamUser = new Steam.SteamUser(steamClient),
    steamFriends = new Steam.SteamFriends(steamClient),
    steamGC = new Steam.SteamGameCoordinator(steamClient, 730),
    CSGOCli = new CSGO.CSGOClient(steamUser, steamGC, false),
    should = require('should'),
    crypto = require('crypto');

function MakeSha(bytes) {
    var hash = crypto.createHash('sha1');
    hash.update(bytes);
    return hash.digest();
}

Steam.servers = JSON.parse(`[{"host":"162.254.195.47","port":27019},{"host":"162.254.195.47","port":27018},{"host":"162.254.195.46","port":27017},{"host":"162.254.195.44","port":27018},{"host":"162.254.195.45","port":27018},{"host":"162.254.195.44","port":27019},{"host":"162.254.195.45","port":27019},{"host":"162.254.195.44","port":27017},{"host":"162.254.195.46","port":27019},{"host":"162.254.195.45","port":27017},{"host":"162.254.195.46","port":27018},{"host":"162.254.195.47","port":27017},{"host":"162.254.193.47","port":27018},{"host":"162.254.193.6","port":27017},{"host":"162.254.193.46","port":27017},{"host":"162.254.193.7","port":27019},{"host":"162.254.193.6","port":27018},{"host":"162.254.193.6","port":27019},{"host":"162.254.193.47","port":27017},{"host":"162.254.193.46","port":27019},{"host":"162.254.193.7","port":27018},{"host":"162.254.193.47","port":27019},{"host":"162.254.193.7","port":27017},{"host":"162.254.193.46","port":27018},{"host":"155.133.254.132","port":27017},{"host":"155.133.254.132","port":27018},{"host":"205.196.6.75","port":27017},{"host":"155.133.254.133","port":27019},{"host":"155.133.254.133","port":27017},{"host":"155.133.254.133","port":27018},{"host":"155.133.254.132","port":27019},{"host":"205.196.6.67","port":27018},{"host":"205.196.6.67","port":27017},{"host":"205.196.6.75","port":27019},{"host":"205.196.6.67","port":27019},{"host":"205.196.6.75","port":27018},{"host":"162.254.192.108","port":27018},{"host":"162.254.192.100","port":27017},{"host":"162.254.192.101","port":27017},{"host":"162.254.192.108","port":27019},{"host":"162.254.192.109","port":27019},{"host":"162.254.192.100","port":27018},{"host":"162.254.192.108","port":27017},{"host":"162.254.192.101","port":27019},{"host":"162.254.192.109","port":27018},{"host":"162.254.192.101","port":27018},{"host":"162.254.192.109","port":27017},{"host":"162.254.192.100","port":27019},{"host":"162.254.196.68","port":27019},{"host":"162.254.196.83","port":27019},{"host":"162.254.196.68","port":27017},{"host":"162.254.196.67","port":27017},{"host":"162.254.196.67","port":27019},{"host":"162.254.196.83","port":27017},{"host":"162.254.196.84","port":27019},{"host":"162.254.196.84","port":27017},{"host":"162.254.196.83","port":27018},{"host":"162.254.196.68","port":27018},{"host":"162.254.196.84","port":27018},{"host":"162.254.196.67","port":27018},{"host":"155.133.248.53","port":27017},{"host":"155.133.248.50","port":27017},{"host":"155.133.248.51","port":27017},{"host":"155.133.248.52","port":27019},{"host":"155.133.248.53","port":27019},{"host":"155.133.248.52","port":27018},{"host":"155.133.248.52","port":27017},{"host":"155.133.248.51","port":27019},{"host":"155.133.248.53","port":27018},{"host":"155.133.248.50","port":27018},{"host":"155.133.248.51","port":27018},{"host":"155.133.248.50","port":27019},{"host":"155.133.246.69","port":27017},{"host":"155.133.246.68","port":27018},{"host":"155.133.246.68","port":27017},{"host":"155.133.246.69","port":27018},{"host":"155.133.246.68","port":27019},{"host":"155.133.246.69","port":27019},{"host":"162.254.197.42","port":27018},{"host":"146.66.152.10","port":27018}]`);

var connectedToSteam = false,
    connectedToGC = false,
    loggedInToSteam = false;

function beConnectedToSteam(done) {
    if (connectedToSteam) return done();
    setTimeout(() => beConnectedToSteam(done), 1000);
}

function beLoggedInToSteam(done) {
    if (loggedInToSteam) return done();
    setTimeout(() => beLoggedInToSteam(done), 1000);
}

function beConnectedToGC(done) {
    if (connectedToGC) return done();
    setTimeout(() => beConnectedToGC(done), 1000);
}

CSGOCli.on('unready', () => {
    steamClient.disconnect();
    console.error("Connection to GC has been lost. Failing.");
    process.exit(1);
});

after((done) => {
    steamClient.disconnect();
    done();
});

describe('Steam', () => {
    describe('#connect', () => {
        it('should connect to Steam', (done) => {
            steamClient.connect();
            steamClient.on('connected', () => {
                connectedToSteam = true;
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
});

describe('CSGO', () => {
    before(beLoggedInToSteam);

    describe('#launch', () => {
        it('should launch CSGO and connect to the GC', function(done) {
            this.timeout(20000);

            steamFriends.setPersonaState(Steam.EPersonaState.Invisible);
            CSGOCli.launch();

            CSGOCli.on('ready', () => {
                connectedToGC = true;
                done();
            });
        });
    });

    describe('#utils', () => {
        before(beConnectedToGC);

        it('should convert a steam ID to an account ID', (done) => {
            should.exist(steamClient.steamID)
            should.equal(CSGOCli.ToAccountID(steamClient.steamID), 51829904);
            done();
        });
    });

    var mmStatsChecked = false;
    describe('#mmstats', () => {
        before(beConnectedToGC);

        it('should request and receive matchmaking stats', (done) => {
            CSGOCli.matchmakingStatsRequest();
            CSGOCli.on('matchmakingStatsData', (data) => {
                if (mmStatsChecked) return;
                mmStatsChecked = true;

                should.exist(data.global_stats);
                done();
            });
        });
    });

    describe('#profile', () => {
        before(beConnectedToGC);

        var profileStatsChecked = false;
        it('should request and receive profile stats', (done) => {
            CSGOCli.playerProfileRequest(CSGOCli.ToAccountID(steamClient.steamID));
            CSGOCli.on('playerProfile', function(profile) {
                if (profileStatsChecked) return;
                profileStatsChecked = true;

                should.exist(profile.account_profiles[0]);
                should.equal(profile.account_profiles[0].account_id, CSGOCli.ToAccountID(steamClient.steamID));
                done();
            });
        });

        var matchListChecked = false;
        it('should request recent games', (done) => {
            CSGOCli.requestRecentGames();
            CSGOCli.on('matchList', (list) => {
                if (matchListChecked) return;
                matchListChecked = true;

                should.equal(list.accountid, CSGOCli.ToAccountID(steamClient.steamID));
                (list.matches).should.be.a.Array();
                done();
            });
        });
    });

    describe('#items', () => {
        before(beConnectedToGC);

        it('should request item data', (done) => {
            CSGOCli.itemDataRequest('76561198084749846', '6768147729', '12557175561287951743', '0');  
            CSGOCli.on('itemData', (itemdata) => {
                const itemInfo = itemdata.iteminfo;
                should(itemInfo.defindex).be.a.Number()
                should(itemInfo.paintindex).be.a.Number()
                should(itemInfo.rarity).be.a.Number()
                should(itemInfo.quality).be.a.Number()
                should(itemInfo.paintwear).be.a.Number()
                should(itemInfo.paintseed).be.a.Number()
                should(itemInfo.stickers).be.a.Array()
                should(itemInfo.inventory).be.a.Number()
                done();
            });
        });
    });
});