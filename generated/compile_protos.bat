@echo off

set PROTODIR=D:\GitHub\SteamKit\Resources\Protobufs
set PROTOBUFS=base_gcmessages gcsdk_gcmessages cstrike15_gcmessages

for %%X in ( %PROTOBUFS% ) do (
	protoc --descriptor_set_out=%%X.desc --include_imports --proto_path=protos protos\%%X.proto
)
