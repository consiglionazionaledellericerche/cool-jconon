version: '2'
services:
    parco-auto:
        image: docker.si.cnr.it/##{CONTAINER_ID}##
        network_mode: bridge
        links:
            - parco-auto-postgresql:parco-auto-postgresql
        extra_hosts:
            - "ace-webapp.test.si.cnr.it:150.146.206.186"
        environment:
            - JAVA_OPTS=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=8787
            - SPRING_PROFILES_ACTIVE=dev,swagger
            - SPRING_DATASOURCE_URL=jdbc:postgresql://parco-auto-postgresql:5432/parcoauto
            - JHIPSTER_SLEEP=10 # gives time for the database to boot before the application
        labels:
            - SERVICE_NAME=##{SERVICE_NAME}##

    parco-auto-postgresql:
        image: postgres:10.4
        network_mode: bridge
        environment:
            - POSTGRES_USER=parcoauto
            - POSTGRES_PASSWORD=
