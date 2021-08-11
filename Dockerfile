# DOCKER-VERSION 1.12
FROM anapsix/alpine-java:jdk8
MAINTAINER glauco <glauco.rampogna@comune.preganziol.tv.it> 
COPY ./api.io.italia.it.crt /opt/api.io.italia.it.crt
RUN /opt/jdk/bin/keytool -import -file /opt/api.io.italia.it.crt -alias api.io.italia.it -keystore /opt/jdk/jre/lib/security/cacerts -noprompt -storepass changeit
#ENV TZ="Europe/Rome"
#RUN date
RUN 	apk upgrade --update &&  \
	apk add --no-cache tzdata && \
	cp /usr/share/zoneinfo/Europe/Rome /etc/localtime && \
	echo "Europe/Rome" >  /etc/timezone && \
	apk add --update curl ca-certificates bash && \
	apk update && apk add ca-certificates && update-ca-certificates && apk add openssl

COPY ./import-letsencrypt-java.sh /opt/import-letsencrypt-java.sh
RUN /bin/bash /opt/import-letsencrypt-java.sh

RUN adduser -D -s /bin/sh jconon
WORKDIR /home/jconon
USER jconon

ADD cool-jconon-webapp/target/*.war /opt/jconon.war

EXPOSE 8080

# https://spring.io/guides/gs/spring-boot-docker/#_containerize_it
CMD ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/opt/jconon.war"]
