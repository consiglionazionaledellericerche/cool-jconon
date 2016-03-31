jconon:
  image: docker.si.cnr.it/$$documentale/cool-jconon:test$$
  ports:
    - "8280:8080"
  command: /opt/apache-tomcat-7/bin/catalina.sh run
  environment:
  - LANG=en_US.UTF-8
  - LANGUAGE=en_US:en
  - LC_ALL=en_US.UTF-8
  - SERVICE_TAGS=master
