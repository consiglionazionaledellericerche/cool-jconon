#! /bin/bash

docker run --rm \
  -v $(pwd)/target:/opt/:ro \
  java:8 \
  java -jar /opt/jconon.war --hazelcast.members=172.17.0.1,172.17.0.2,172.17.0.3,172.17.0.4
