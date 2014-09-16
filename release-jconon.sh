#!/bin/sh
#
# jconon release
# unit tests are skipped by default
#
# deploy to as7.cedrc.cnr.it AND as8.cedrc.cnr.it
#
# ssh selezioni@as8.cedrc.cnr.it
#
# ./jbossselezioni stop
# tailf /opt/jboss/server/selezioni/log/server.log #wait for server to shutdown
# cd /opt/jboss-4.2.2.GA/server/selezioni/deploy/
# wget http://bandt.si.cnr.it:8180/jenkins/job/cool-jconon/ws/cool-jconon/target/jconon.war # download latest jconon.war from jenkins
# ./jbossselezioni start

# otherwise, download the artifact from Nexus:
# http://bandt.si.cnr.it:8280/nexus/content/groups/public/it/cnr/si/cool/cool-jconon/1.4.0/cool-jconon-1.4.0.war

# WARNING: fare riferimento al valore "Goals and options" in
# http://bandt.si.cnr.it:8180/jenkins/job/cool-jconon/configure
mvn clean install -Pjconon,produzione -DskipTests