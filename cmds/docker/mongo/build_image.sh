#!/bin/bash -xe

cd cmds/docker/mongo
mkdir -p gen
if [ ! -d gen/util ]; then
    cp -r ../util gen/util
fi

docker build -t "mongo_iyv" .
rm -rf gen
