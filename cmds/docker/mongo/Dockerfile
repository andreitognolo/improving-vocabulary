FROM ubuntu:14.04
ENV DEBIAN_FRONTEND noninteractive
WORKDIR /opt

RUN apt-get update
RUN apt-get install vim curl wget -y
RUN mkdir -p scripts
ADD gen/util scripts

RUN mkdir -p /home/mongodb

WORKDIR /home/mongodb
ADD scripts .
RUN  ./install.sh

RUN chown -R mongodb:mongodb /home/mongodb

EXPOSE 27017

CMD [ "/home/mongodb/up.sh" ]
