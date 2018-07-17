import { formatBodyContent, getUrl } from '../src/helpers';

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