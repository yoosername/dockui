FROM node:alpine
ADD . /app
WORKDIR /app
RUN npm install
ENTRYPOINT ["node", "/app/src/cli/CLI.js"]