import Api from '../src/api';
import nock from 'nock';
import fetch from 'node-fetch';
global.fetch = fetch;    

function buildApi(options = {}) {
  return new Api({ scheme: 'http', baseUrl: 'google.fr', ...options });
}

test('Api throws error if any of the mandatory params are missing', () => {
  expect(() => new Api({ scheme: 'http' })).toThrow('Missing baseUrl');
});

test('Api does not throws error when config is valid', () => {
  expect(() => new Api({ scheme: 'http', baseUrl: 'google.fr' }))
    .not
    .toThrow();
});

test('getUrl can return absolute url', () => {
  const api = buildApi();
  expect(api.getUrl('http://fidme.com')).toEqual('http://fidme.com')
});

test('getUrl can build url based on a path and config', () => {
  const api = buildApi();
  expect(api.getUrl('/coucou')).toEqual('http://google.fr/coucou')
});

test('Api can request absolute url', async () => {
  const api = buildApi();
  
  nock('http://dzadza.com').get('/coucou').reply(200, 'path matched');
  
  const res = await api.request('http://dzadza.com/coucou');
  expect(res.status).toEqual(200);
  expect(res.body).toEqual('path matched');
});

test('Request returns body and status of the request', async () => {
  const api = buildApi();

  nock('http://dzadza.com').get('/coucou').reply(200, '{"data":"ok"}');

  const res = await api.request('http://dzadza.com/coucou');
  expect(res.status).toEqual(200);
  expect(res.body).toEqual({ data: 'ok' });
});


test('Request calls every afterEach', async () => {
  let didCallAfterEach = false;
  const api = buildApi({ afterEach: [(res) => {didCallAfterEach = true}] });

  nock('http://dzadza.com').get('/coucou').reply(200, 'lol');

  await api.request('http://dzadza.com/coucou');
  expect(didCallAfterEach).toBe(true);
});

test('Request calls every afterEach', async () => {
  let afterEachRes = null;
  const api = buildApi({ afterEach: [(res) => { afterEachRes = res; }] });

  nock('http://dzadza.com').get('/coucou').reply(200, 'lol');

  const res = await api.request('http://dzadza.com/coucou');
  expect(afterEachRes).toEqual(res);
});


test('api adds headers to each request', async () => {
  const api = buildApi({ 
    headers: {
      'Content-Type': 'Application/JSON',
      'X-Auth-Token': () => { return 'COUCOU' }
    }
  })

  const headers = api.headers();
  expect(headers['X-Auth-Token']).toEqual('COUCOU');
});

test('api can make get request', async () => {
  const api = buildApi();
  nock('http://google.fr').get('/coucou').reply(200, 'lol');
  
  const res = await api.get('coucou');
  
  expect(res.status).toEqual(200);
  expect(res.body).toEqual('lol');
});

test('api can make post request', async () => {
  const api = buildApi();
  nock('http://google.fr').post('/coucou').reply(200, 'lol');

  const res = await api.post('coucou', { salut: 'lol' });

  expect(res.status).toEqual(200);
  expect(res.body).toEqual('lol');
});

test('api can make put request', async () => {
  const api = buildApi();
  nock('http://google.fr').put('/coucou').reply(200, 'lol');

  const res = await api.put('coucou', { salut: 'lol' });

  expect(res.status).toEqual(200);
  expect(res.body).toEqual('lol');
});

test('api can make delete request', async () => {
  const api = buildApi();
  nock('http://google.fr').delete('/coucou').reply(200, 'lol');

  const res = await api.delete('coucou');

  expect(res.status).toEqual(200);
  expect(res.body).toEqual('lol');
});