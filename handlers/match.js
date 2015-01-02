var CSGO = require("../index"),
    fs = require("fs"),
    util = require("util"),
    Schema = require('protobuf').Schema,
    base_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/base_gcmessages.desc")),
    gcsdk_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/gcsdk_gcmessages.desc")),
    csgo_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/cstrike15_gcmessages.desc")),
    protoMask = 0x80000000;

CSGO.CSGOClient.prototype.matchmakingStatsRequest = function() {
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending matchmaking stats request");

  

  var payload = csgo_gcmessages.CMsgGCCStrike15_v2_MatchmakingClient2GCHello.serialize({});
  console.log(JSON.stringify(payload));
  this._client.toGC(this._appid, (CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_MatchmakingClient2GCHello | protoMask), payload);
};

CSGO.CSGOClient.prototype.playerProfileRequest = function(accountId, callback) {
  callback = callback || null;
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready")
    return null;
  }
  
  if (this.debug) util.log("Sending player profile request");
  
  var payload = csgo_gcmessages.CMsgGCCStrike15_v2_ClientRequestPlayersProfile.serialize({
    accountId: accountId
  });

  this._client.toGC(this._appid, (CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_ClientRequestPlayersProfile | protoMask), payload, callback);
}

var handlers = CSGO.CSGOClient.prototype._handlers;

handlers[CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_MatchmakingGC2ClientHello] = function onMatchmakingStatsResponse(message) {
  // Is not Job ID based - can't do callbacks.
  var matchmakingStatsResponse = csgo_gcmessages.CMsgGCCStrike15_v2_MatchmakingGC2ClientHello.parse(message);

  if (this.debug) util.log("Received matchmaking stats");
  this.emit("matchmakingStatsData", matchmakingStatsResponse);
};

handlers[CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_PlayersProfile] = function onPlayerProfileResponse(message) {
  var playerProfileResponse = csgo_gcmessages.CMsgGCCStrike15_v2_PlayersProfile.parse(message);
  
  if (this.debug) util.log("Received player profile");
  this.emit("playerProfile", playerProfileResponse);
}