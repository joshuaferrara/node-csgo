var Protobuf = require('protobufjs');

Protobuf.convertFieldsToCamelCase = false;

var builder = Protobuf.newBuilder();
Protobuf.loadProtoFile(__dirname + "/generated/protos/base_gcmessages.proto", builder);
Protobuf.loadProtoFile(__dirname + "/generated/protos/gcsdk_gcmessages.proto", builder);
Protobuf.loadProtoFile(__dirname + "/generated/protos/cstrike15_gcmessages.proto", builder);
module.exports = builder.build();
