#!/usr/bin/sh

JMX="http://as3.cedrc.cnr.it:8080/jmx-console/HtmlAdaptor"

LIST="action=invokeOp&name=jboss.web%3Atype%3DManager%2Cpath%3D%2Fjconon%2Chost%3Dlocalhost&methodIndex=1"

for line in `curl $JMX -d$LIST | sed -e 's| |\n|g' | grep selezioni`;do
DATA="action=invokeOp&name=jboss.web%3Atype%3DManager%2Cpath%3D%2Fjconon%2Chost%3Dlocalhost&methodIndex=3&arg0=$line&arg1=_alf_USER_ID"
  echo $line
  curl $JMX -d$DATA -s | grep pre -A1 | grep -v pre
done