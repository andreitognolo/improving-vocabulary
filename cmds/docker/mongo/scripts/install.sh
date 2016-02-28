#!/bin/bash

apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
apt-get update
apt-get install mongodb-10gen=2.4.14 -y
mkdir -p /data/db

service mongodb start;
EXIST=`cat /var/log/mongodb/mongodb.log | grep "web console waiting for connections"`
while [ "x$EXIST" == "x" ]; do
  EXIST=`cat /var/log/mongodb/mongodb.log | grep "web console waiting for connections"`
  sleep 5;
done;
mongo  improveyourvocabulary --eval 'db.addUser("admin", "4nVL27YyApru");'
