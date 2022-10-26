FROM node:16-slim@sha256:ab17602860f174138391dd02375cc497d81fd2e8010006a016f91f0ab87700f4

WORKDIR /usr/src/app

ARG GIT_SHA

COPY . .

ENV NODE_ENV=production
ENV PORT 4500
ENV GIT_SHA=${GIT_SHA}

EXPOSE ${PORT}

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

CMD ["npm", "start"]
