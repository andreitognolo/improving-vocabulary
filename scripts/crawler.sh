#!/bin/sh

mkdir -p images

for i in `seq 1 1862`;
do
  curl "http://www.whattheduck.net/home?page=1%2C$i" > /tmp/site.html
  img_url=$(cat /tmp/site.html | grep sites/default/files/WTD | grep div | grep img \
    | sed s/.*src=\"// \
    | sed s/\".*//)

  img_name=$(echo $img_url | sed s/.*WTD//)

  curl "http://www.whattheduck.net/$img_url" > images/$img_name
done