#!/bin/bash -e

if [ "x$1" == "x" ]; then
	echo "Script usage:"
	echo "./keep-testing.sh service/EpisodeServiceTest.js" 
	exit 1;
fi;

while true
do
   ATIME=`stat -c %Z $1`
   if [[ "$ATIME" != "$LTIME" ]]
   then
   		echo "==================================="
		echo "======== Change detected =========="
		echo "==================================="
		echo ""
		
		if [ -f /tmp/file_monitor_result ]; then
			rm /tmp/file_monitor_result	
		fi
		
		rm -rf /tmp/error
		node test-runner.js ./$1 2>> /tmp/error ||
		
		result=""
		result=$(cat /tmp/error)
		
		time=$(date +%T)
		if [ "$result" == "" ]
		then
    		notify-send "$time - PASSED"
    	else
    		cat /tmp/error
    		notify-send "$time - FAILLLLLLLL"
		fi
       LTIME=$ATIME
   fi
   sleep 1
done
