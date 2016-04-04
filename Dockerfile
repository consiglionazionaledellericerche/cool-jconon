# DOCKER-VERSION 1.10.0
FROM      tomcat:7-jre7
MAINTAINER Francesco Uliana <francesco.uliana@cnr.it>

COPY target/*.war /usr/local/tomcat/webapps/
