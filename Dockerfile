FROM alpine

RUN apk add --update nodejs

# Ensure modules get cached for speedy rebuilds
RUN npm install -g nodemon
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

WORKDIR /usr/src/app
COPY . /usr/src/app

EXPOSE 8080

CMD [ "node", "App.js" ]
