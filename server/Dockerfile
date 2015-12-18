FROM    centos:centos6

# Enable EPEL for Node.js
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
# Install Node.js and npm
RUN     yum install -y npm

# Bundle app source
COPY ./MailJetFromRedis /opt/src
# Install app dependencies
RUN cd /opt/src; ls; npm install /opt/src

CMD ["node", "/opt/src/main.js"]