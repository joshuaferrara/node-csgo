var CSGO = require("../index"),
    fs = require("fs"),
    util = require("util"),
    Schema = require('protobuf').Schema,
    base_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/base_gcmessages.desc")),
    gcsdk_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/gcsdk_gcmessages.desc")),
    csgo_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/cstrike15_gcmessages.desc")),
    protoMask = 0x80000000;

CSGO.CSGOClient.prototype.matchDetailsRequest = function(matchId, callback) {
  callback = callback || null;

  /* Sends a message to the Game Coordinator requesting `matchId`'s match details.  Listen for `matchData` event for Game Coordinator's response. */

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending match details request");
  var payload = csgo_gcmessages.CMsgGCMatchDetailsRequest.serialize({
    "matchId": matchId
  });

  this._client.toGC(this._appid, (CSGO.EDOTAGCMsg.k_EMsgGCMatchDetailsRequest | protoMask), payload, callback);
};

CSGO.CSGOClient.prototype.matchmakingStatsRequest = function() {
  /* Sends a message to the Game Coordinator requesting `matchId`'s match deails.  Listen for `matchData` event for Game Coordinator's response. */
  // Is not Job ID based - can't do callbacks.

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending matchmaking stats request");

  var payload = csgo_gcmessages.CMsgGCCStrike15_v2_MatchmakingClient2GCHello.serialize({});

  this._client.toGC(this._appid, (CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_MatchmakingClient2GCHello | protoMask), payload);
};

var handlers = CSGO.CSGOClient.prototype._handlers;

handlers[CSGO.EDOTAGCMsg.k_EMsgGCMatchDetailsResponse] = function onMatchDetailsResponse(message, callback) {
  callback = callback || null;
  var matchDetailsResponse = csgo_gcmessages.CMsgGCMatchDetailsResponse.parse(message);

  if (matchDetailsResponse.result === 1) {
    if (this.debug) util.log("Received match data for: " + matchDetailsResponse.match.matchId);
    this.emit("matchData", matchDetailsResponse.match.matchId, matchDetailsResponse);
    if (callback) callback(null, matchDetailsResponse);
  }
  else {
      if (this.debug) util.log("Received a bad matchDetailsResponse");
      if (callback) callback(matchDetailsResponse.result, matchDetailsResponse);
  }
};

handlers[CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_MatchmakingGC2ClientHello] = function onMatchmakingStatsResponse(message) {
  // Is not Job ID based - can't do callbacks.
  var matchmakingStatsResponse = csgo_gcmessages.CMsgGCCStrike15_v2_MatchmakingGC2ClientHello.parse(message);

  if (this.debug) util.log("Received matchmaking stats");
  this.emit("matchmakingStatsData", matchmakingStatsResponse);
};