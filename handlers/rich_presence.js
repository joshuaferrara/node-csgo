var CSGO = require("../index"),
    util = require("util"),
    protos = require("../protos");

CSGO.CSGOClient.prototype.richPresenceRequest = function(steamids, callback){
  this._gc._client.send({
        msg: CSGO.EMsg.ClientRichPresenceRequest,
        proto: {
          routing_appid: 730
        }
      },
      new protos.schema.CMsgClientRichPresenceRequest({
        steamid_request: steamids
      }).toBuffer(), callback);
};

CSGO.CSGOClient.prototype.richPresenceUpload = function(rp, steamids, callback){
  var payload = new protos.schema.CMsgClientRichPresenceUpload();
  payload.rich_presence_kv = require("../VDF").encode(rp);
  if(this.debug){
      util.log("Rich presence Payload:")
      console.log(payload.rich_presence_kv);
  }
  if(steamids){
    payload.steamid_broadcast = steamids;
  }
  this._gc._client.send({
        msg: CSGO.EMsg.ClientRichPresenceUpload,
        proto: {
          routing_appid: 730
        }
      },
      payload.toBuffer(), callback);
};

var handlers = CSGO.CSGOClient.prototype._handlers;

handlers[CSGO.EMsg.ClientRichPresenceInfo] = function(data) {
  var vdf = require('../VDF');
  var response_kv = protos.schema.CMsgClientRichPresenceInfo.decode(data);
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
