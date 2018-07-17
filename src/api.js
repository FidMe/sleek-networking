import { formatBodyContent, getEachHeaderValue, getUrl } from './helpers';
import ResponseFormatter from './response-formatter';

class Api {
  constructor(options) {
    this.mantadoryParams = [ 'scheme', 'baseUrl', ];
    this.options = { afterEach: [], headers: {}, ...options };
    this.validateOptions();
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

  async request(path, method, body, headers) {
    const response = await fetch(getUrl(this.url, path), {
      headers: this.headers(headers),
      body: formatBodyContent(body),
      method,
    });

    const formattedResponse = new ResponseFormatter(response).format();
    this.options.afterEach.forEach(async fn => fn(await formattedResponse));
    return formattedResponse;
  }

  headers(additionals = {}) {
    const retrievedHeaders = getEachHeaderValue(this.options.headers);

    return { ...additionals, ...retrievedHeaders };
  }

  validateOptions() {
    this.mantadoryParams.forEach(mandatoryParam => {
      if (!this.options[mandatoryParam]) throw new Error(`Missing ${mandatoryParam}`);
    })
    this.url = `${this.options.scheme}://${this.options.baseUrl}`;
  }
}

export default Api;