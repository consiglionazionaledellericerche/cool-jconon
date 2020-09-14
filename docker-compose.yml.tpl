version: '2'
services:
    parco-auto:
        image: docker.si.cnr.it/##{CONTAINER_ID}##
        network_mode: bridge
        links:
            - parco-auto-postgresql:parco-auto-postgresql
        extra_hosts:
            - "zuul-server.test.si.cnr.it:150.146.206.186"
            - "sigla-main.test.si.cnr.it:150.146.206.186"
            - "sigla-print.test.si.cnr.it:150.146.206.186"
        environment:
            - JAVA_OPTS=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=8787
            - SPRING_PROFILES_ACTIVE=dev,swagger
            - SPRING_DATASOURCE_URL=jdbc:postgresql://parco-auto-postgresql:5432/parcoauto
            - SPRING_DATASOURCE_PASSWORD=parcoautopw
            - SPRING_JPA_DATABASE_PLATFORM=io.github.jhipster.domain.util.FixedPostgreSQL82Dialect
            - SPRING_JPA_DATABASE=POSTGRESQL
            - JHIPSTER_SLEEP=10 # gives time for the database to boot before the application
        labels:
            - SERVICE_NAME=##{SERVICE_NAME}##

    parco-auto-postgresql:
        image: postgres:10.4
        network_mode: bridge
        environment:
            - POSTGRES_USER=parcoauto
            - POSTGRES_PASSWORD=parcoautopw
            - PG_WORK_MEM=64MB
            - PG_MAINTENANCE_WORK_MEM=512MB
        command: postgres -c max_connections=300 -c log_min_messages=LOG -c 'shared_buffers=512MB'
        volumes:
            - ./pgdata:/var/lib/postgresql/data/
