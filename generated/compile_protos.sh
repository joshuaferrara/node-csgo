protoc --descriptor_set_out=base_gcmessages.desc --include_imports --proto_path=./ ./base_gcmessages.proto
protoc --descriptor_set_out=gcsdk_gcmessages.desc --include_imports --proto_path=./ ./gcsdk_gcmessages.proto
protoc --descriptor_set_out=cstrike15_gcmessages.desc --include_imports --proto_path=./ ./cstrike15_gcmessages.proto
