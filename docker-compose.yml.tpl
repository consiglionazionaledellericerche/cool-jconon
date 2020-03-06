version: '2'
services:
    parco-auto:
        image: docker.si.cnr.it/##{CONTAINER_ID}##
        network_mode: bridge
        links:
            - parco-auto-postgresql:parco-auto-postgresql
        environment:
            - JAVA_OPTS=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=8787
            - SPRING_PROFILES_ACTIVE=prod,swagger
            - SPRING_DATASOURCE_URL=jdbc:postgresql://parco-auto-postgresql:5432/parcoauto
            - JHIPSTER_SLEEP=10 # gives time for the database to boot before the application
    parco-auto-postgresql:
        image: postgres:10.4
        network_mode: bridge
        environment:
            - POSTGRES_USER=parcoauto
            - POSTGRES_PASSWORD=
    nginx:
        image: nginx:1.13-alpine
        network_mode: bridge
        environment:
            - 'FASTCGI_READ_TIMEOUT=300s'
        links:
            - parco-auto:parco-auto
        labels:
            SERVICE_NAME: "##{SERVICE_NAME}##"
        read_only: true
        volumes:
            - ./conf.d/:/etc/nginx/conf.d/
            - /var/cache/nginx/
            - /var/run/
