import nock from 'nock';
import fetch from 'node-fetch';
import { Api, Jwt } from '../src';

global.fetch = fetch;

function buildApi(options = {}) {
  return new Api({ scheme: 'http', baseUrl: 'google.fr', ...options });
}

test('Api throws error if any of the mandatory params are missing', () => {
  expect(() => new Api({ scheme: 'http' })).toThrow('Missing baseUrl');
});

test('Api does not throws error when config is valid', () => {
  expect(() => new Api({ scheme: 'http', baseUrl: 'google.fr' })).not.toThrow();
});

test('Api can request absolute url', async () => {
  const api = buildApi();

  nock('http://dzadza.com')
    .get('/coucou')
    .reply(200, 'path matched');

  const res = await api.request('http://dzadza.com/coucou');
  expect(res.status).toEqual(200);
  expect(res.body).toEqual('path matched');
});

test('Request returns body and status of the request', async () => {
  const api = buildApi();

  nock('http://dzadza.com')
    .get('/coucou')
    .reply(200, '{"data":"ok"}');

  const res = await api.request('http://dzadza.com/coucou');
  expect(res.status).toEqual(200);
  expect(res.body).toEqual({ data: 'ok' });
});

test('Request calls every afterEach', async () => {
  let afterEachRes = null;
  const api = buildApi({
    afterEach: [
      (res) => {
        afterEachRes = res;
      },
    ],
  });

  nock('http://dzadza.com')
    .get('/coucou')
    .reply(200, 'lol');

  const res = await api.request('http://dzadza.com/coucou');
  expect(afterEachRes).toEqual(res);
});

test('Request calls every onError', async () => {
  const onErrorCb = jest.fn();
  const api = buildApi({ onError: [onErrorCb] });

  await api.request('http://dzadza.com/coucou');

  expect(onErrorCb).toHaveBeenCalled();
});

test('Request returns response instance', async () => {
  const api = buildApi();
  nock('http://google.fr')
    .get('/coucou')
    .reply(200, 'lol');

  const res = await api.get('coucou');
  expect(res.constructor.name).toEqual('Response');
});

test('Request returns response instance even if request fails', async () => {
  const onErrorCb = jest.fn();
  const api = buildApi({ onError: [onErrorCb] });

  const res = await api.request('http://dzadza.com/coucou');

  expect(onErrorCb).toHaveBeenCalled();
  expect(res.constructor.name).toEqual('Response');
});

test('api adds headers to each request', async () => {
  const api = buildApi({
    headers: {
      'Content-Type': 'Application/JSON',
      'X-Auth-Token': request => `COUCOU${request.path}${request.method}`,
    },
  });
  api.get('lol');
  const headers = api.currentRequest.headers();
  expect(headers['X-Auth-Token']).toEqual('COUCOUlolget');
});

test('api can make get request', async () => {
  const api = buildApi();
  nock('http://google.fr')
    .get('/coucou')
    .reply(200, 'lol');

  const res = await api.get('coucou');

  expect(res.status).toEqual(200);
  expect(res.body).toEqual('lol');
});

test('api can make post request', async () => {
  const api = buildApi();
  nock('http://google.fr')
    .post('/coucou')
    .reply(200, 'lol');

  const res = await api.post('coucou', { salut: 'lol' });

  expect(res.status).toEqual(200);
  expect(res.body).toEqual('lol');
});

test('api can make put request', async () => {
  const api = buildApi();
  nock('http://google.fr')
    .put('/coucou')
    .reply(200, 'lol');

  const res = await api.put('coucou', { salut: 'lol' });

  expect(res.status).toEqual(200);
  expect(res.body).toEqual('lol');
});

test('api can make delete request', async () => {
  const api = buildApi();
  nock('http://google.fr')
    .delete('/coucou')
    .reply(200, 'lol');

  const res = await api.delete('coucou');

  expect(res.status).toEqual(200);
  expect(res.body).toEqual('lol');
});

test('api can retry if request fails', async () => {
  const api = buildApi({
    scheme: 'http',
    baseUrl: 'google',
    retriesCount: 5,
  });
  const fetchh = jest.spyOn(api, 'fetch');
  try {
    await api.get('coucou');
  } catch (error) {
    //
  }

  expect(fetchh).toHaveBeenCalledTimes(6);
  fetchh.mockClear();
});

test('retriesCount can also be configured on each request', async () => {
  const api = buildApi({ scheme: 'http', baseUrl: 'google' });
  const fetchh = jest.spyOn(api, 'fetch');

  try {
    await api.get('coucou', { retriesCount: 8 });
  } catch (error) {
    //
  }

  expect(fetchh).toHaveBeenCalledTimes(9);
});

test('can add jwt token to every headers', async () => {
  const tokenToAdd = new Jwt('123').generateToken({
    path: 'coucou',
    method: 'get',
  });
  const api = buildApi({
    headers: {
      token: request => new Jwt('123').generateToken({
        path: request.path,
        method: request.method,
      }),
    },
  });

  nock('http://google.fr')
    .get('/coucou')
    .reply(200, 'lol');

  await api.get('coucou');

  expect(tokenToAdd).toEqual(api.currentRequest.headers().token);
});

test('can retrieve timestamp from currentRequest', async () => {
  const api = buildApi();

  nock('http://google.fr')
    .get('/coucou')
    .reply(200, 'lol');

  await api.get('coucou');

  expect(api.currentRequest.timestamp).toBeTruthy();
});

test('can add timeout params to a request', async () => {
  const api = buildApi({ scheme: 'http', baseUrl: 'google' });
  const fetchh = jest.spyOn(api, 'fetch');

  try {
    await api.get('coucou', { retriesCount: 8, timeout: 2000 });
  } catch (error) {
    //
  }

  expect(fetchh).toHaveBeenCalledWith('http://google/coucou', {
    timeout: 2000,
    body: undefined,
    headers: {},
    method: 'get',
  });
});

test('timeout options adds actual timeout errors', async () => {
  const api = buildApi({ scheme: 'http', baseUrl: 'google.com', timeout: 20 });
  nock('http://google.com')
    .persist()
    .get('/coucou')
    .reply((_, __, cb) => {
      setTimeout(() => cb(null, [201, 'THIS IS THE REPLY BODY']), 30);
    });

  expect((await api.get('coucou')).error).not.toBeFalsy();

  expect((await api.get('coucou', { timeout: 40 })).error).toBeFalsy();
});
