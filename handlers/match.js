var CSGO = require("../index"),
    util = require("util"),
    protos = require("../protos"),
    protoMask = 0x80000000;

CSGO.CSGOClient.prototype.matchmakingStatsRequest = function() {
  if (!this._gcReady) {
    if (this.debug) {
      util.log("GC not ready, please listen for the 'ready' event.");
    }
    return null;
  }

  if (this.debug) {
    util.log("Sending matchmaking stats request");
  }

  var payload = new protos.CMsgGCCStrike15_v2_MatchmakingClient2GCHello({});
  console.log(JSON.stringify(payload));
  this._client.toGC(this._appid, (CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_MatchmakingClient2GCHello | protoMask), payload.toBuffer());
};

CSGO.CSGOClient.prototype.playerProfileRequest = function(accountId, callback) {
  callback = callback || null;
  if (!this._gcReady) {
    if (this.debug) {
      util.log("GC not ready")
    }
    return null;
  }

  if (this.debug) {
    util.log("Sending player profile request");
  }

  var payload = new protos.CMsgGCCStrike15_v2_ClientRequestPlayersProfile({
    accountId: accountId,
    requestLevel: 32
  });

  this._client.toGC(this._appid, (CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_ClientRequestPlayersProfile | protoMask), payload.toBuffer(), callback);
};

CSGO.CSGOClient.prototype.requestRecentGames = function(accid, callback) {
  callback = callback || null;
  if (!this._gcReady) {
    if (this.debug) {
      util.log("GC not ready")
    }
    return null;
  }

  if (this.debug) {
    util.log("Sending recent match request with ID of " + accid);
  }

  var payload = new protos.CMsgGCCStrike15_v2_MatchListRequestRecentUserGames({
    accountid: accid
  });

  this._client.toGC(this._appid, (CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_MatchListRequestRecentUserGames | protoMask), payload.toBuffer(), callback);
};

var handlers = CSGO.CSGOClient.prototype._handlers;

handlers[CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_MatchmakingGC2ClientHello] = function onMatchmakingStatsResponse(message) {
  var matchmakingStatsResponse = protos.CMsgGCCStrike15_v2_MatchmakingGC2ClientHello.decode(message);

  if (this.debug) {
    util.log("Received matchmaking stats");
  }
  this.emit("matchmakingStatsData", matchmakingStatsResponse);
};

handlers[CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_PlayersProfile] = function onPlayerProfileResponse(message) {
  var playerProfileResponse = protos.CMsgGCCStrike15_v2_PlayersProfile.decode(message);

  if (this.debug) {
    util.log("Received player profile");
  }
  this.emit("playerProfile", playerProfileResponse);
};

handlers[CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_MatchList] = function(message) {
  var matchListResponse = protos.CMsgGCCStrike15_v2_MatchList.decode(message);

  if (this.debug) {
    util.log("Received match list");
  }
  this.emit("matchList", matchListResponse);
};