FROM alpine

RUN apk add --update nodejs

RUN mkdir -p /usr/src/app

VOLUME ["/usr/src/app/"]
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install
RUN npm install -g nodemon

EXPOSE 8080

CMD [ "node", "App.js" ]
