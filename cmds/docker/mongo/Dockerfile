FROM ubuntu:14.04
ENV DEBIAN_FRONTEND noninteractive
WORKDIR /opt

RUN apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
RUN echo 'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
RUN apt-get update
RUN apt-get install vim curl wget mongodb-10gen=2.4.14 -y

RUN mkdir -p scripts
ADD gen/util scripts
RUN ./scripts/add-user.sh mongo


WORKDIR /home/mongo
USER mongo
