FROM alpine

RUN apk add --update nodejs

RUN mkdir -p /usr/src/app

VOLUME ["/usr/src/app/"]
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install
RUN npm install nodemon -g

EXPOSE 8080

CMD [ "nodemon", "-e", "js,css,html", "App.js" ]
