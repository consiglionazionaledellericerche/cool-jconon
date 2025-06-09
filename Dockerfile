# DOCKER-VERSION 1.12
FROM anapsix/alpine-java:jdk8
MAINTAINER Marco Spasiano <marco.spasiano@cnr.it>

COPY cert/  /cert

RUN $JAVA_HOME/bin/keytool -import -keystore $JAVA_HOME/jre/lib/security/cacerts -storepass changeit -noprompt -file "/cert/GEANT TLS RSA 1.crt" -alias "GEANT TLS RSA"

RUN adduser -D -s /bin/sh jconon
WORKDIR /home/jconon
USER jconon

ADD cool-jconon-webapp/target/*.war /opt/jconon.war

EXPOSE 8080

# https://spring.io/guides/gs/spring-boot-docker/#_containerize_it
CMD ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/opt/jconon.war"]
