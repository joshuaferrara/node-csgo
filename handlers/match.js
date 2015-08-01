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
  this._gc.send({msg:CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_MatchmakingClient2GCHello, proto: {}},
      payload.toBuffer());
};


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

  var payload = new protos.CMsgGCCStrike15_v2_ClientRequestPlayersProfile({
    account_id: accountId,
    request_level: req_level || 32
  });
  this._gc.send({msg:CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_ClientRequestPlayersProfile, proto: {}},
      payload.toBuffer(), callback);
};
CSGO.CSGOClient.prototype.requestCurrentLiveGames = function(callback) {
  callback = callback || null;
  if (!this._gcReady) {
    if (this.debug) {
      util.log("GC not ready");
    }
    return null;
  }

  if (this.debug) {
    util.log("Sending live matches");
  }

  var payload = new protos.CMsgGCCStrike15_v2_MatchListRequestCurrentLiveGames();
  this._gc.send({msg:CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_MatchListRequestCurrentLiveGames , proto: {}},
      payload.toBuffer(), callback);
};
CSGO.CSGOClient.prototype.requestLiveGameForUser = function(accountid, callback) {
  callback = callback || null;
  if (!this._gcReady) {
    if (this.debug) {
      util.log("GC not ready");
    }
    return null;
  }

  if (this.debug) {
    util.log("Sending live matches");
  }

  var payload = new protos.CMsgGCCStrike15_v2_MatchListRequestLiveGameForUser({
    accountid: accountid
  });
  this._gc.send({msg:CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_MatchListRequestLiveGameForUser , proto: {}},
      payload.toBuffer(), callback);
};

CSGO.CSGOClient.prototype.requestWatchInfoFriends = function(request, callback) {
  callback = callback || null;
  if (!this._gcReady) {
    if (this.debug) {
      util.log("GC not ready");
    }
    return null;
  }

  if (this.debug) {
    util.log("Sending watch info request");
  }

  var payload = new protos.CMsgGCCStrike15_v2_ClientRequestWatchInfoFriends(request);
  this._gc.send({msg:CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_ClientRequestWatchInfoFriends2, proto: {}},
      payload.toBuffer(), callback);
};

CSGO.CSGOClient.prototype.requestGame = function(matchid, outcome, token, callback) {
  callback = callback || null;
  if (!this._gcReady) {
    if (this.debug) {
      util.log("GC not ready");
    }
    return null;
  }

  if (this.debug) {
    util.log("Sending info match request with ID of " + matchid);
  }

  var payload = new protos.CMsgGCCStrike15_v2_MatchListRequestFullGameInfo({

  });
  if(matchid){
    payload.matchid = matchid;
  }
  if(outcome){
    payload.outcomeid = outcome;
  }
  if(token){
    payload.token = token;
  }
  this._gc.send({msg:CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_MatchListRequestFullGameInfom, proto: {}},
      payload.toBuffer(), callback);
};

CSGO.CSGOClient.prototype.requestRecentGames = function(accid, callback) {
  callback = callback || null;
  if (!this._gcReady) {
    if (this.debug) {
      util.log("GC not ready");
    }
    return null;
  }

  if (this.debug) {
    util.log("Sending recent match request with ID of " + accid);
  }

  var payload = new protos.CMsgGCCStrike15_v2_MatchListRequestRecentUserGames({
    accountid: accid
  });
  this._gc.send({msg:CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_MatchListRequestRecentUserGames, proto: {}},
      payload.toBuffer(), callback)
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
handlers[CSGO.ECSGOCMsg.k_EMsgGCCStrike15_v2_WatchInfoUsers] = function(message){
  var response = protos.CMsgGCCStrike15_v2_WatchInfoUsers.decode(message);
  if(this.debug){
    util.log('Recieved watch info')
  }
  this.emit('watchList', response);
}