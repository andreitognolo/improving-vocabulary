#!/bin/bash -xe
USER=$1

if [ "x$USER" == "x" ]; then
    echo "MUST HAVE USER"
    exit 0;
fi

groupadd supersudo && echo "%supersudo ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/supersudo
adduser --disabled-password --gecos $USER $USER && usermod -a -G supersudo $USER && mkdir -p /home/$USER/.ssh
sudo chown -R $USER:$USER /home/$USER
