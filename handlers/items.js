var CSGO = require("../index"),
    util = require("util"),
    protos = require("steam-resources");

CSGO.CSGOClient.prototype.itemDataRequest = function(s, a, d, m) {
  /* 
    An inspect link will include s or m depending on whether the 
    item is in an inventory or the market

    If there is no value for a parameter, set it to "0"

    REMEMBER: The parameters must be strings in order for JavaScript to keep precision
  */

  if (!this._gcReady) {
    if (this.debug) {
      util.log("GC not ready");
    }
    return null;
  }

  if (this.debug) {
    util.log("Sending item data request");
  }

  var payload = new protos.GC.CSGO.Internal.CMsgGCCStrike15_v2_Client2GCEconPreviewDataBlockRequest({
    param_s: s,
    param_a: a,
    param_d: d,
    param_m: m
  });

  this._gc.send({msg: protos.GC.CSGO.Internal.ECsgoGCMsg.k_EMsgGCCStrike15_v2_Client2GCEconPreviewDataBlockRequest, proto: {}},
      payload.toBuffer());
};

var handlers = CSGO.CSGOClient.prototype._handlers;

handlers[protos.GC.CSGO.Internal.ECsgoGCMsg.k_EMsgGCCStrike15_v2_Client2GCEconPreviewDataBlockResponse] = function onItemDataResponse(message) {
  var itemDataResponse = protos.GC.CSGO.Internal.CMsgGCCStrike15_v2_Client2GCEconPreviewDataBlockResponse.decode(message);

  if (this.debug) {
    util.log("Received item data");
  }

  // Convert the paintwear uint32 to float
  if ("iteminfo" in itemDataResponse && "paintwear" in itemDataResponse["iteminfo"]) {
    floatbuffer = new Buffer(4);
    floatbuffer.writeUInt32LE(itemDataResponse["iteminfo"]["paintwear"], 0);
    itemDataResponse["iteminfo"]["floatvalue"] = floatbuffer.readFloatLE(0);
  }

  this.emit("itemData", itemDataResponse);
};
