FROM node:10

RUN mkdir -p /opt/app

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

ARG PORT=8080
ENV PORT $PORT
EXPOSE $PORT

WORKDIR /opt/app
COPY package.json package-lock.json* ./

RUN npm install && npm cache clean --force
COPY . /opt/app

CMD [ "npm","run", "start" ]