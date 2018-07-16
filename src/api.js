import { isJsonResponse, getEachHeaderValue, formatBodyContent } from './helper';

class Api {
  constructor(options) {
    this.mantadoryParams = [ 'scheme', 'baseUrl', ];
    this.options = { afterEach: [], headers: {}, ...options };
    this.validateOptions();
  }

  getUrl(url) {
    if (url.substring(0, 4) === 'http') return url;
    const parsedUrl = (url.charAt(0) === '/') ? url.substring(1) : url;

    return `${this.url}/${parsedUrl}`;
  }

  async compactResponse(response) {
    const returnCompactedResponse = body => ({
      body,
      status: response.status,
      headers: response.headers,
    });

    if (await isJsonResponse(response)) return response.json().then(body => returnCompactedResponse(body));
    else return response.text().then(body => returnCompactedResponse(body));
  }

  headers(additionals = {}) {
    const retrievedHeaders = getEachHeaderValue(this.options.headers);

    return { ...additionals, ...retrievedHeaders };
  }

  async request(url, method, body, headers) {
    const response = await fetch(this.getUrl(url), {
      headers: this.headers(headers),
      body: formatBodyContent(body),
      method,
    });

    const compactedResponse = this.compactResponse(response);
    this.options.afterEach.forEach(async fn => fn(await compactedResponse));
    return compactedResponse;
  }
  
  get(url, headers = {}) {
    return this.request(url, 'get', undefined, headers);
  }

  post(url, body = {}, headers = {}) {
    return this.request(url, 'post', body, headers);
  }

  put(url, body = {}, headers = {}) {
    return this.request(url, 'put', body, headers);
  }

  delete(url, headers = {}) {
    return this.request(url, 'delete', undefined, headers);
  }

  validateOptions() {
    this.mantadoryParams.forEach(mandatoryParam => {
      if (!this.options[mandatoryParam]) throw new Error(`Missing ${mandatoryParam}`);
    })

    this.url = `${this.options.scheme}://${this.options.baseUrl}`;
  }
}

export default Api;