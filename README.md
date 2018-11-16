# Sleek Networking, 🚀

[![npm version](https://badge.fury.io/js/sleek-networking.svg)](https://badge.fury.io/js/sleek-networking)
[![dependencies status](https://david-dm.org/FidMe/sleek-networking/status.svg)](https://david-dm.org/FidMe/sleek-networking)

A simple and efficient `fetch` wrapper that works across any Javascript (React/React Native/Vue JS, etc) app.
It provides you with a clean and consistent way to call your Api, meanwhile handling JWT authentication, middlewares, etc.

### Features

- JWT authentication
- Transparent absolute or relative url handling
- Request retry
- Middlewares
- Custom headers functions

### Install

`npm install --save sleek-networking`

or

`yarn add sleek-networking`

### Api wrapper

In order to use the Api across your app, you need to instantiate it with your configuration.
Here are the params you may pass to it :

```javascript
import { Api, Jwt } from "sleek-networking";

const api = new Api({
  scheme: "http",
  retriesCount: 0,
  baseUrl: "google.fr/api/v1",
  afterEach: [() => {}],
  onError: [() => {}],
  headers: {
    "content-type": "Application/JSON",
    "X-Auth-Token": () => new Jwt("1234").generateToken()
  }
});
```

### Use it across your app like that

```javascript
api.get("posts", options);
api.post("posts", body, options);
api.put("posts", body, options);
api.delete("posts", options);

api.get("posts").then(res => console.log(res));
/* 
Every request returns an object containing this format :
{ status: 200, body: { parsed: "JSON" }, header }
*/
```

By default, sleek-networking will assume you want to deal with JSON only.
If you query a JSON endpoint, no need to parse it afterwards.
If your Api returns something different from readable JSON, it will be returned as raw text.

If you want to send something different from Json, for example form data, you need to do the following :

```javascript
const formData = new FormData();
formData.append("key", "value");

api.post("yourendpoint", formData, {
  headers: [("Content-Type": "multipart/form-data; boundary=----yourboundary")]
});
```

### Providing JWT Header

With Sleek Networking it becomes easy to add JWT auth to your entire app. Simply import Jwt, provide your secret,

```javascript
import { Jwt } from "sleek-networking";

new Jwt(secret, optionalPayload, optionalHeader).generateToken(optionalPayload);
```

### Retrying fetch request

In case your request fails (timeout or no network), you can provide a `retriesCount` option to your config, and also to a single request configuration like that :

```javascript
api.get("posts", { retriesCount: 5 });
```

### Middlewares

You can execute code after executing a request and before returning it to your app.
In order to do so, provide your config with a list of `afterEach: [() => {}]` functions to execute.

Example use case, disconnecting a user after any `401` received

```javascript
new Api({
  ...restOfConfigOptions,
  afterEach: [verifyAuthentication, doSomethingElse]
});

function verifyAuthentication(response) {
  if (response.status === 401) user.logout();
}
```

### Custom header function

In case you need to execute a function to add a header to any HTTP request, you may provide a function to your header configuration.

For example that allows you to use any kind of authentication library (in case your do not like the included JWT 😁).

```javascript
new Api({
  ...restOfConfigOptions,
  headers: {
    "Content-Type": "Application/JSON",
    "Custom-Request-Signature": request => functionToCallEverytime(),
    "X-Auth-Token": request => new Jwt("1234").generateToken()
  }
});
```

If you need to visualize the request informations when processing your custom header function, you have a complete access to the `Request` object.

For example, say you need to add the HTTP method to the JWT payload, you can proceed like that :

```javascript
'X-Auth-Token': request => new Jwt('1234').generateToken({ method: request.method }),
});
```

You can access anything related to the current Request including :

- `request.url`
- `request.path`
- `request.method`
- `request.body`
- `request.options` which is an object containing `headers` and other fetch/api options

### Contribute

Please add consistent testing when contributing.
Run tests with `npm test`.
