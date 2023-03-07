# axios-ddos-guard-bypass

Library to bypass DDoS Guard protection (https://ddos-guard.net/en) using Node and Axios.

- Wrapper for `AxiosInstance`, uses [Axios interceptors](https://axios-http.com/docs/interceptors)
- Automatically detect if we encounter DDoS Guard protection, bypass it and repeat the request
- Automatically handle cookies (needed to bypass the protection) using [CookieJar](https://github.com/salesforce/tough-cookie#cookiejar)
- Supports proxy

## Installation

```
npm install axios-ddos-guard-bypass
```

## Usage

Example with custom `CookieJar`:

```js
import axios from 'axios';
import { ddosGuardBypass } from 'axios-ddos-guard-bypass';
import { CookieJar } from 'tough-cookie';

let serviceUrl = 'https://ddos-guard.net';
let headers = {
  Referer: serviceUrl
};

let cookieJar = new CookieJar();
let agent = axios.create({
  jar: cookieJar
});

ddosGuardBypass(agent);

let response = await agent({
  url: serviceUrl,
  headers: headers
});

// We can access cookies directly from our cookieJar
const cookies = cookieJar.getCookiesSync(serviceUrl);
```

Example without `CookieJar`:

```js
import axios from 'axios';
import { ddosGuardBypass } from 'axios-ddos-guard-bypass';

let serviceUrl = 'https://ddos-guard.net';
let headers = {
  Referer: serviceUrl
};

let agent = axios.create();

ddosGuardBypass(agent);

let response = await agent({
  url: serviceUrl,
  headers: headers
});

// CookieJar is accessible in response.config
const cookies = response.config.jar.getCookiesSync(serviceUrl);
```

Example with proxy:

```js
import axios from 'axios';
import { ddosGuardBypass } from 'axios-ddos-guard-bypass';

let serviceUrl = 'https://ddos-guard.net';
let headers = {
  Referer: serviceUrl
};

let agent = axios.create();

ddosGuardBypass(agent);

let response = await agent({
  url: serviceUrl,
  headers: headers,
  proxy: {
    protocol: 'http',
    host: '127.0.0.1',
    port: 8888
  }
});
```

## Limitations

Retrying the request is not possible if we are sending a stream-like data (`FormData`, `ReadableStream`, etc.), as the stream is already drained, in such a case it will throw an `Error`.

We can pass a `Buffer` if we want our request to be repeated:

```js
import axios from 'axios';
import FormData from `form-data`;
import { ddosGuardBypass } from 'axios-ddos-guard-bypass';

let agent = axios.create();

ddosGuardBypass(agent);

let headers = {
    'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
};

let form = new FormData();
form.append('file', imageBinaryData, {
    'someFilename.png'
});

// We call form.getBuffer() to read the data info a Buffer instance
// form.getHeaders() will provide headers, like Content-Type: multipart/form-data; boundary=...
let response = await agent.post(uploadUrl, form.getBuffer(), {
    headers: {
        ...headers,
        ...form.getHeaders()
    }
});

```
