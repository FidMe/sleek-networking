import nock from 'nock';
import fetch from 'node-fetch';
global.fetch = fetch;    

import { isJsonResponse, formatBodyContent, getUrl } from '../src/helper';

test('isJsonResponse can detect body type', async () => {
  nock('http://notAJSON.com').get('/').reply(200, 'NOTAJSON');
  
  const notAJsonResponse = await fetch('http://notAJSON.com')
  expect(await isJsonResponse(notAJsonResponse)).toBe(false);
  
  nock('http://AJSON.com').get('/').reply(200, '{"a":"json"}');
  const AJsonResponse = await fetch('http://AJSON.com')
  expect(await isJsonResponse(AJsonResponse)).toBeTruthy();
});


test('formatBodyContent can parse json', () => {
  const bodyContent = formatBodyContent({ coucou: 'lol' });
  expect(JSON.parse(bodyContent)).toEqual({ coucou: 'lol' });
});

test('formatBodyContent can output raw text if needed', () => {
  const bodyContent = formatBodyContent('undefined');
  expect(bodyContent).toEqual('undefined');
});

test('getUrl can return absolute url', () => {
  expect(getUrl('http://google.fr','http://fidme.com')).toEqual('http://fidme.com')
});

test('getUrl can build url based on a path and config', () => {
  expect(getUrl('http://google.fr', '/coucou')).toEqual('http://google.fr/coucou')
});