# Braze Content Proxy API

Provides Pocket Hits stories to be consumed by Connected Content blocks in Braze.

## Application Overview

[Express](https://expressjs.com/) is the Node framework, [Apollo Client](https://www.apollographql.com/docs/react/) is used in Express to request data from [Client API](https://github.com/Pocket/client-api/).

## Caching

### API-side caching

TBA

### Braze-side caching

Braze caches Connected Content for a minimum of 5 minutes (and recommends setting the value to 15 minutes): [Connected Content: Configurable Caching](https://www.braze.com/docs/user_guide/personalization_and_dynamic_content/connected_content/local_connected_content_variables/#configurable-caching).

## Local Development

- Clone the repository:

```bash
git clone git@github.com:Pocket/braze-content-proxy.git

cd braze-content-proxy
```

- Install the packages:

```bash
npm install
```

- Start the app:

```bash
npm run start:dev
```

- Load `http://localhost:4500` in your browser. Done!