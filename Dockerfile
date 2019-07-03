FROM node:alpine
RUN apk add openssl
ADD . /app
WORKDIR /app
RUN npm install
RUN npm -g install nodemon
RUN mkdir -p /tmp/dockui/certs && /app/tools/gen_ssl_cert.sh
CMD ["nodemon", "-x","/app/src/cli/CLI.js", "run"]