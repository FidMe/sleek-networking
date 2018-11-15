import nock from 'nock';
import fetch from 'node-fetch';
import ResponseFormatter from '../src/response-formatter';

global.fetch = fetch;


test('isJsonResponse can detect body type', async () => {
  nock('http://notAJSON.com').get('/').reply(200, 'NOTAJSON');

  const notAJsonResponse = await fetch('http://notAJSON.com');
  expect(await new ResponseFormatter(notAJsonResponse).isJsonResponse()).toBe(false);

  nock('http://AJSON.com').get('/').reply(200, '{"a":"json"}');
  const AJsonResponse = await fetch('http://AJSON.com');
  expect(await new ResponseFormatter(AJsonResponse).isJsonResponse()).toBeTruthy();
});
