jconon:
  image: docker.si.cnr.it/##{CONTAINER_ID}##
  read_only: true
  environment:
  - JAVA_OPTS='-Xmx256m'
  - LANG=en_US.UTF-8
  - LANGUAGE=en_US:en
  - LC_ALL=en_US.UTF-8
  - SERVICE_TAGS=webapp
  - SERVICE_NAME=##{SERVICE_NAME}##
  volumes:
  - ./webapp_logs:/opt/logs
  - ./webapp_tmp:/tmp
  command: java -Xmx256m -Xss512k -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=8787 -Djava.security.egd=file:/dev/./urandom -jar /opt/jconon.war --spring.profiles.active=prod
