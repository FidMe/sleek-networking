export function getEachHeaderValue(headers) {
  let retrievedValuesOfHeaders = {};
  const headersAsArray = Object.entries(headers);

  headersAsArray.forEach(value => {
    retrievedValuesOfHeaders[value[0]] = (typeof value[1] === 'function') ? value[1]() : value[1];
  });

  return retrievedValuesOfHeaders;
}

export function formatBodyContent(body) {
  return (typeof body === 'object') ? JSON.stringify(body) : body;
}

export function getUrl(baseUrl, pathOrAbsolute) {
  if (pathOrAbsolute.substring(0, 4) === 'http') return pathOrAbsolute;
  const parsedUrl = (pathOrAbsolute.charAt(0) === '/') ? pathOrAbsolute.substring(1) : pathOrAbsolute;

  return `${baseUrl}/${parsedUrl}`;
}