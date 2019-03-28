FROM oraclelinux:7-slim
#FROM centos/nodejs-8-centos7
#FROM node:8.15.1-jessie

#
# Create working directory and copy project into it
#

#
# Installing and Configuring Nodejs
#

RUN yum install -y oracle-nodejs-release-el7 oracle-release-el7
RUN yum install -y nodejs

WORKDIR /myApp
ADD . /myApp

#
# Install Oracle Instant Client base (plus other required packages / tools)
#

RUN yum -y install libaio
RUN yum -y install http://yum.oracle.com/repo/OracleLinux/OL7/oracle/instantclient/x86_64/getPackage/oracle-instantclient18.5-basic-18.5.0.0.0-3.x86_64.rpm
# Install SQL*Plus package if required
#RUN yum -y install http://yum.oracle.com/repo/OracleLinux/OL7/oracle/instantclient/x86_64/getPackage/oracle-instantclient18.5-sqlplus-18.5.0.0.0-3.x86_64.rpm

#
# Reference location of Instant Client lib files in LD_LIBRARY_PATH
#

ENV LD_LIBRARY_PATH="/usr/lib/oracle/18.5/client64/lib/"

#
# Add the InstantClient bin directory to the PATH
#

ENV PATH="/usr/lib/oracle/18.5/client64/bin:${PATH}"

#
# Reference location of directory holding tnsnames.ora file
#

ENV TNS_ADMIN="/myApp/oradbInstantClient/network/admin"
WORKDIR /myApp/oradbInstantClient/network/admin
RUN sed -i 's#/vagrant#/myApp#g' ./sqlnet.ora 

# To build this docker image use
# docker build -t apisforlawenforcement:0.1 .
#
# To run this from docker within vagrant
# docker run --env-file setEnv -p 3000:3000 -it apisforlawenforcement:0.1 
#

#
# Run the app.js on container start
#

RUN npm install
EXPOSE 3000
CMD npm start
