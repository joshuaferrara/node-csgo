var CSGO = require("../index"),
    util = require("util"),
    protos = require("steam-resources"),
    vdf = require('../helpers/VDF');

CSGO.CSGOClient.prototype.richPresenceRequest = function(steamids, callback){
  this._gc._client.send({
        msg: protos.EMsg.ClientRichPresenceRequest,
        proto: {
          routing_appid: 730
        }
      },
      new protos.Internal.CMsgClientRichPresenceRequest({
        steamid_request: steamids
      }).toBuffer(), callback);
};

CSGO.CSGOClient.prototype.richPresenceUpload = function(rp, steamids, callback){
  var payload = new protos.Internal.CMsgClientRichPresenceUpload();
  payload.rich_presence_kv = vdf.encode(rp);
  if(this.debug){
      util.log("Rich presence Payload:")
      console.log(payload.rich_presence_kv);
  }
  if(steamids){
    payload.steamid_broadcast = steamids;
  }
  this._gc._client.send({
        msg: protos.EMsg.ClientRichPresenceUpload,
        proto: {
          routing_appid: 730
        }
      },
      payload.toBuffer(), callback);
};

var handlers = CSGO.CSGOClient.prototype._handlers;

handlers[protos.EMsg.ClientRichPresenceInfo] = function(data) {
  var response_kv = protos.Internal.CMsgClientRichPresenceInfo.decode(data);
  var output = {};
  for(var index in response_kv.rich_presence){
    if(response_kv.rich_presence.hasOwnProperty(index)){
      var rp = vdf.decode(response_kv.rich_presence[index].rich_presence_kv.toBuffer());
      if(rp.hasOwnProperty('RP')) {
        rp = rp.RP;
      }
      output[response_kv.rich_presence[index].steamid_user] = rp;
    }
  }
  this.emit('richPresenceInfo', output);
};
