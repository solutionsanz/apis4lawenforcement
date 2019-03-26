FROM node:8.11.4

RUN apt-get update

#
# Create working directory and copy project into it
#
WORKDIR /myApp
ADD . /myApp

#
# Installing and Configuring Node-Oracledb with Oracle DB Instant Client
#
ENV LD_LIBRARY_PATH="/myApp/oradbInstantClient"
ENV TNS_ADMIN="/myApp/oradbInstantClient/network/admin"

WORKDIR /myApp/oradbInstantClient/network/admin

RUN apt-get install libaio1 -y && sed -i 's#/vagrant#/myApp#g' ./sqlnet.ora 

# 
# Download Package dependencies and run app...
#

# To build this docker image use
# docker build -t apisforlawenforcement:0.1 .
#
# To run this from docker within vagrant
# docker run --env-file setEnv -p 3000:3000 -it 056919aa25ec
#

RUN npm install
EXPOSE 3000
CMD npm start

