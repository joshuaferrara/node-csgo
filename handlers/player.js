var CSGO = require("../index"),
    util = require("util"),
    protos = require("steam-resources");

CSGO.CSGOClient.prototype.playerProfileRequest = function(accountId, req_level, callback) {
  callback = callback || null;
  if (!this._gcReady) {
    if (this.debug) {
      util.log("GC not ready");
    }
    return null;
  }

  if (this.debug) {
    util.log("Sending player profile request");
  }

  var payload = new protos.GC.CSGO.Internal.CMsgGCCStrike15_v2_ClientRequestPlayersProfile({
    account_id: accountId,
    request_level: req_level || 32
  });
  this._gc.send({msg: protos.GC.CSGO.Internal.ECsgoGCMsg.k_EMsgGCCStrike15_v2_ClientRequestPlayersProfile, proto: {}},
      payload.toBuffer(), callback);
};

var handlers = CSGO.CSGOClient.prototype._handlers;

handlers[protos.GC.CSGO.Internal.ECsgoGCMsg.k_EMsgGCCStrike15_v2_PlayersProfile] = function onPlayerProfileResponse(message) {
  var playerProfileResponse = protos.GC.CSGO.Internal.CMsgGCCStrike15_v2_PlayersProfile.decode(message);

  if (this.debug) {
    util.log("Received player profile");
  }
  this.emit("playerProfile", playerProfileResponse);
};