FROM alpine

RUN apk add --update nodejs

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install nodemon -g
RUN npm install

EXPOSE 8080

CMD [ "node", "Plugin.js" ]
