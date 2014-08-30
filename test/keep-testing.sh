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
        red='\e[1;33m'
        NC='\e[0m' # No Color
        echo -e "${red}    ____________    ___________    ________  _____    _   __________________      "
        echo "   / ____/  _/ /   / ____/ ___/   / ____/ / / /   |  / | / / ____/ ____/ __ \     "
        echo "  / /_   / // /   / __/  \__ \   / /   / /_/ / /| | /  |/ / / __/ __/ / / / /  (_)"
        echo " / __/ _/ // /___/ /___ ___/ /  / /___/ __  / ___ |/ /|  / /_/ / /___/ /_/ /      "
        echo -e "/_/   /___/_____/_____//____/   \____/_/ /_/_/  |_/_/ |_/\____/_____/_____/    (_)${NC}"
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
