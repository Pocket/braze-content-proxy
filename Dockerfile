FROM node:16-slim@sha256:5fcfc1c34cdde861d5a22bb19a4b0a56c53623a198a7f65ad7cc89dd98af1824

WORKDIR /usr/src/app

ARG GIT_SHA

COPY . .

ENV NODE_ENV=production
ENV PORT 4500
ENV GIT_SHA=${GIT_SHA}

EXPOSE ${PORT}

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

CMD ["npm", "start"]
