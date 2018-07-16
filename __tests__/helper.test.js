import { formatBodyContent } from '../src/helper';


test('formatBodyContent can parse json', () => {
  const bodyContent = formatBodyContent({ coucou: 'lol' });
  expect(JSON.parse(bodyContent)).toEqual({ coucou: 'lol' });
});

test('formatBodyContent can output raw text if needed', () => {
  const bodyContent = formatBodyContent('undefined');
  expect(bodyContent).toEqual('undefined');
});
