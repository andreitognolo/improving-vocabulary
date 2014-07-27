#!/bin/bash -e

if [ "x$1" == "x" ]; then
	echo "Script usage:"
	echo "./keep-testing.sh service/EpisodeServiceTest.js" 
	exit 1;
fi;

while true
do
   # Expecting changes in any file of previous directory
   ATIME=0
   for k in $(find ..|grep -v node_modules|grep -v img); do
      file_time=$(stat -c %Z $k)
      if [ $file_time -gt $ATIME ]; then
         ATIME=$file_time
      fi
   done
	
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
