#!/bin/bash
sudo service mongodb start;
EXIST=`cat /var/log/mongodb/mongodb.log | grep "web console waiting for connections"`
while [ "x$EXIST" == "x" ]; do
  EXIST=`cat /var/log/mongodb/mongodb.log | grep "web console waiting for connections"`
  sleep 5;
done;
tail -f /var/log/mongodb/mongodb.log
