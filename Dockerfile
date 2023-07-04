FROM node:16-slim@sha256:4f382c964b581fb2aa2202eec2bf4f8b16b2aeaf5dd912380871118c5cb26c4b

WORKDIR /usr/src/app

ARG GIT_SHA

COPY . .

ENV NODE_ENV=production
ENV PORT 4500
ENV GIT_SHA=${GIT_SHA}

EXPOSE ${PORT}

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

CMD ["npm", "start"]
