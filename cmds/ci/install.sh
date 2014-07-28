#!bin/bash
FOLDER=`pwd | grep impl`

if [ "x$FOLDER" == "x" ]; then
	cd impl/;
fi

npm install;