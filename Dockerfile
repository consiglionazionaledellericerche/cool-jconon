# DOCKER-VERSION 1.10.0
FROM      docker.si.cnr.it/centos-tomcat7
MAINTAINER Francesco Uliana <francesco.uliana@cnr.it>

COPY target/*.war /opt/apache-tomcat-7/webapps/

EXPOSE 8080
