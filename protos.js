var Protobuf = require('protobufjs');

Protobuf.convertFieldsToCamelCase = true;

var builder = Protobuf.newBuilder();
Protobuf.loadProtoFile(__dirname + "/generated/base_gcmessages.desc", builder);
Protobuf.loadProtoFile(__dirname + "/generated/gcsdk_gcmessages.desc", builder);
Protobuf.loadProtoFile(__dirname + "/generated/cstrike15_gcmessages.desc", builder);
module.exports = builder.build();
