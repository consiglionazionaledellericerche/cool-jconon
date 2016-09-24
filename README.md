# deployment in production

    wget "http://maven.si.cnr.it/service/local/artifact/maven/redirect?r=releases&v=LATEST&g=it.cnr.si.cool.jconon&a=cool-jconon&e=war" -O jconon.war

# access cache
    ssh ${username}@localhost -p 2000

## run with docker

docker run --rm  -p 8180:8080 --name jconon1 -v $(pwd):/usr/local/tomcat/webapps/ tomcat:7-jre8
