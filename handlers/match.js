var CSGO = require("../index"),
    util = require("util"),
    protos = require("steam-resources");

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

  var payload = new protos.GC.CSGO.Internal.CMsgGCCStrike15_v2_MatchmakingClient2GCHello({});
  this._gc.send({msg: protos.GC.CSGO.Internal.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchmakingClient2GCHello, proto: {}},
      payload.toBuffer());
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

  var payload = new protos.GC.CSGO.Internal.CMsgGCCStrike15_v2_MatchListRequestCurrentLiveGames();
  this._gc.send({msg: protos.GC.CSGO.Internal.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchListRequestCurrentLiveGames , proto: {}},
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

  var payload = new protos.GC.CSGO.Internal.CMsgGCCStrike15_v2_MatchListRequestLiveGameForUser({
    accountid: accountid
  });
  this._gc.send({msg: protos.GC.CSGO.Internal.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchListRequestLiveGameForUser , proto: {}},
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

  var payload = new protos.GC.CSGO.Internal.CMsgGCCStrike15_v2_ClientRequestWatchInfoFriends(request);
  this._gc.send({msg: protos.GC.CSGO.Internal.ECsgoGCMsg.k_EMsgGCCStrike15_v2_ClientRequestWatchInfoFriends2, proto: {}},
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

  var payload = new protos.GC.CSGO.Internal.CMsgGCCStrike15_v2_MatchListRequestFullGameInfo({

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
  this._gc.send({msg: protos.GC.CSGO.Internal.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchListRequestFullGameInfo, proto: {}},
      payload.toBuffer(), callback);
};

CSGO.CSGOClient.prototype.requestRecentGames = function(arg1, arg2) {
  if (!this._gcReady) {
    if (this.debug) {
      util.log("GC not ready");
    }
    return null;
  }
  
  var accid = this.ToAccountID(this._user._client.steamID);
  var callback;
  if (arguments.length >= 2) {
    callback = arg2 || null;
    util.log("Warning: The accountId parameter for requestRecentGames has been deprecated. The logged in bot accounts ID will be used.");
  } else if (arguments.length == 1) {
    if (typeof arg1 == 'function') {
      callback = arg1 || null;
    } else {
      util.log("Warning: The accountId parameter for requestRecentGames has been deprecated. The logged in bot accounts ID will be used.");
    }
  }

  if (this.debug) {
    util.log("Sending recent match request with ID of " + accid);
  }

  var payload = new protos.GC.CSGO.Internal.CMsgGCCStrike15_v2_MatchListRequestRecentUserGames({
    accountid: accid
  });
  this._gc.send({msg: protos.GC.CSGO.Internal.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchListRequestRecentUserGames, proto: {}},
      payload.toBuffer(), callback);
  };

var handlers = CSGO.CSGOClient.prototype._handlers;

handlers[protos.GC.CSGO.Internal.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchmakingGC2ClientHello] = function onMatchmakingStatsResponse(message) {
  var matchmakingStatsResponse = protos.GC.CSGO.Internal.CMsgGCCStrike15_v2_MatchmakingGC2ClientHello.decode(message);

  if (this.debug) {
    util.log("Received matchmaking stats");
  }
  this.emit("matchmakingStatsData", matchmakingStatsResponse);
};

handlers[protos.GC.CSGO.Internal.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchList] = function(message) {
  var matchListResponse = protos.GC.CSGO.Internal.CMsgGCCStrike15_v2_MatchList.decode(message);

  if (this.debug) {
    util.log("Received match list");
  }
  this.emit("matchList", matchListResponse);
};

handlers[protos.GC.CSGO.Internal.ECsgoGCMsg.k_EMsgGCCStrike15_v2_WatchInfoUsers] = function(message){
  var response = protos.GC.CSGO.Internal.CMsgGCCStrike15_v2_WatchInfoUsers.decode(message);
  if (this.debug) {
    util.log('Recieved watch info');
  }
  this.emit('watchList', response);
}
