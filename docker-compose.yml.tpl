jconon:
  image: docker.si.cnr.it/##{CONTAINER_ID}##
  mem_limit: 1024m
  read_only: false
  env_file:
      - ./jconon.env
  environment:
  - LANG=it_IT.UTF-8
  - REPOSITORY_BASE_URL=http://as1dock.si.cnr.it:8080/alfresco/
  - SIPER_URL=http://siper.test.si.cnr.it/siper
  - SPID_ENABLE=true
  - SPID_IDP_TEST_REDIRECTURL=http://spid-testenv2.test.si.cnr.it/sso
  - SPID_ASSERTIONCONSUMERSERVICEINDEX=2
  - SPID_ATTRIBUTECONSUMINGSERVICEINDEX=2
  - SPID_DESTINATION=http://cool-jconon.test.si.cnr.it/spid/send-response
  volumes:
  - ./webapp_logs:/logs
  - /tmp
  command: java -Xmx256m -Xss512k -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=8787 -Dfile.encoding=UTF8 -Dserver.servlet.context-path= -Djava.security.egd=file:/dev/./urandom -jar /opt/jconon.war
  labels:
  - SERVICE_NAME=##{SERVICE_NAME}##
