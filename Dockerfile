FROM node:16-slim@sha256:ea666dfc54d35ffd5cd3388420aea8438341b3fbcb9b57bdbaabde652d98fbcd

WORKDIR /usr/src/app

ARG GIT_SHA

COPY . .

ENV NODE_ENV=production
ENV PORT 4500
ENV GIT_SHA=${GIT_SHA}

EXPOSE ${PORT}

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

CMD ["npm", "start"]
