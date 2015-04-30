protoc --descriptor_set_out=base_gcmessages.desc --include_imports --proto_path=./protos protos/base_gcmessages.proto
protoc --descriptor_set_out=gcsdk_gcmessages.desc --include_imports --proto_path=./protos protos/gcsdk_gcmessages.proto
protoc --descriptor_set_out=cstrike15_gcmessages.desc --include_imports --proto_path=./protos protos/cstrike15_gcmessages.proto
