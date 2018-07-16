export async function isJsonResponse(response) {
  try {
    const seeIfResponseIsJSON = response.clone();
    await seeIfResponseIsJSON.json();
    return true;
  } catch (notAJSON) {
    return false;
  }
}

export function getEachHeaderValue(headers) {
  let retrievedValuesOfHeaders = {};
  const headersAsArray = Object.entries(headers);

  headersAsArray.forEach(value => {
    retrievedValuesOfHeaders[value[0]] = (typeof value[1] === 'function') ? value[1]() : value[1];
  });

  return retrievedValuesOfHeaders;
}


export function formatBodyContent(body) {
  if (typeof body === 'object') return JSON.stringify(body);
  else return body;
}
