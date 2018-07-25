import { Api, Jwt } from "../src";
import nock from "nock";
import fetch from "node-fetch";
global.fetch = fetch;

function buildApi(options = {}) {
  return new Api({ scheme: "http", baseUrl: "google.fr", ...options });
}

test("Api throws error if any of the mandatory params are missing", () => {
  expect(() => new Api({ scheme: "http" })).toThrow("Missing baseUrl");
});

test("Api does not throws error when config is valid", () => {
  expect(() => new Api({ scheme: "http", baseUrl: "google.fr" })).not.toThrow();
});

test("Api can request absolute url", async () => {
  const api = buildApi();

  nock("http://dzadza.com")
    .get("/coucou")
    .reply(200, "path matched");

  const res = await api.request("http://dzadza.com/coucou");
  expect(res.status).toEqual(200);
  expect(res.body).toEqual("path matched");
});

test("Request returns body and status of the request", async () => {
  const api = buildApi();

  nock("http://dzadza.com")
    .get("/coucou")
    .reply(200, '{"data":"ok"}');

  const res = await api.request("http://dzadza.com/coucou");
  expect(res.status).toEqual(200);
  expect(res.body).toEqual({ data: "ok" });
});

test("Request calls every afterEach", async () => {
  let afterEachRes = null;
  const api = buildApi({
    afterEach: [
      res => {
        afterEachRes = res;
      }
    ]
  });

  nock("http://dzadza.com")
    .get("/coucou")
    .reply(200, "lol");

  const res = await api.request("http://dzadza.com/coucou");
  expect(afterEachRes).toEqual(res);
});

test("api adds headers to each request", async () => {
  const api = buildApi({
    headers: {
      "Content-Type": "Application/JSON",
      "X-Auth-Token": request => {
        return `COUCOU${request.path}${request.method}`;
      }
    }
  });
  api.get("lol");
  const headers = api.currentRequest.headers();
  expect(headers["X-Auth-Token"]).toEqual("COUCOUlolget");
});

test("api can make get request", async () => {
  const api = buildApi();
  nock("http://google.fr")
    .get("/coucou")
    .reply(200, "lol");

  const res = await api.get("coucou");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual("lol");
});

test("api can make post request", async () => {
  const api = buildApi();
  nock("http://google.fr")
    .post("/coucou")
    .reply(200, "lol");

  const res = await api.post("coucou", { salut: "lol" });

  expect(res.status).toEqual(200);
  expect(res.body).toEqual("lol");
});

test("api can make put request", async () => {
  const api = buildApi();
  nock("http://google.fr")
    .put("/coucou")
    .reply(200, "lol");

  const res = await api.put("coucou", { salut: "lol" });

  expect(res.status).toEqual(200);
  expect(res.body).toEqual("lol");
});

test("api can make delete request", async () => {
  const api = buildApi();
  nock("http://google.fr")
    .delete("/coucou")
    .reply(200, "lol");

  const res = await api.delete("coucou");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual("lol");
});

test("api can retry if request fails", async () => {
  const api = buildApi({ scheme: "htp", baseUrl: "google", retriesCount: 5 });
  const spyedFetch = jest.spyOn(global, "fetch");
  try {
    await api.get("coucou");
  } catch (error) {}

  expect(spyedFetch).toHaveBeenCalledTimes(6);
  spyedFetch.mockClear();
});

test("retriesCount can also be configured on each request", async () => {
  const api = buildApi({ scheme: "htp", baseUrl: "google" });
  const fetchh = jest.spyOn(global, "fetch");
  try {
    await api.get("coucou", { retriesCount: 8 });
  } catch (error) {}

  expect(fetchh).toHaveBeenCalledTimes(9);
});

test("can add jwt token to every headers", async () => {
  const tokenToAdd = new Jwt("123").generateToken({
    path: "coucou",
    method: "get"
  });
  const api = buildApi({
    headers: {
      token: request =>
        new Jwt("123").generateToken({
          path: request.path,
          method: request.method
        })
    }
  });

  nock("http://google.fr")
    .get("/coucou")
    .reply(200, "lol");

  await api.get("coucou");

  expect(tokenToAdd).toEqual(api.currentRequest.headers().token);
});
