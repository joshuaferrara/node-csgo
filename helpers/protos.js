var Protobuf = require('protobufjs');

Protobuf.convertFieldsToCamelCase = false;

var builder = Protobuf.newBuilder();

Protobuf.loadProtoFile(__dirname + "/../protos/base_gcmessages.proto", builder);
Protobuf.loadProtoFile(__dirname + "/../protos/gcsdk_gcmessages.proto", builder);
Protobuf.loadProtoFile(__dirname + "/../protos/cstrike15_gcmessages.proto", builder);
Protobuf.loadProtoFile(__dirname + "/../protos/custom.proto", builder);
module.exports = builder.build();

var builder_steam = Protobuf.newBuilder();
Protobuf.loadProtoFile(__dirname + "/../protos/steammessages_clientserver.proto", builder_steam);
Protobuf.loadProtoFile(__dirname + "/../protos/steammessages_clientserver_2.proto", builder_steam);
module.exports.schema = builder_steam.build();