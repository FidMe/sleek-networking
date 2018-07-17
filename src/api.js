import { formatBodyContent, getEachHeaderValue, getUrl } from './helpers';
import ResponseFormatter from './response-formatter';

export class Api {
  constructor(options) {
    this.mantadoryParams = [ 'scheme', 'baseUrl', ];
    this.options = { afterEach: [], retriesCount: 1, headers: {}, ...options };
    this.validateOptions();
  }

  get(url, options = {}) {
    return this.request(url, 'get', undefined, options);
  }

  post(url, body = {}, options = {}) {
    return this.request(url, 'post', body, options);
  }

  put(url, body = {}, options = {}) {
    return this.request(url, 'put', body, options);
  }

  delete(url, options = {}) {
    return this.request(url, 'delete', undefined, options);
  }

  async request(path, method, body, options = {}) {
    const response = await this.processWithOptions(path, method, body, options);
    const formattedResponse = new ResponseFormatter(response).format();
    this.options.afterEach.forEach(async fn => fn(await formattedResponse));
    return formattedResponse;
  }

  processWithOptions(path, method, body, options) {
    const allOptions = { ...this.options, ...options };

    const fetchRetry = async (url, fetchOptions, n) => {
      try {
        return await fetch(url, fetchOptions);
      } catch (err) {
        if (n === 0) throw err;
        return await fetchRetry(url, fetchOptions, n - 1);
      }
    };

    return fetchRetry(getUrl(this.url, path), {
      headers: this.headers(options.headers),
      body: formatBodyContent(body),
      method,
    }, allOptions.retriesCount);
  }

  headers(additionals = {}) {
    return { ...getEachHeaderValue(this.options.headers), ...additionals };
  }

  validateOptions() {
    this.mantadoryParams.forEach(mandatoryParam => {
      if (!this.options[mandatoryParam]) throw new Error(`Missing ${mandatoryParam}`);
    })
    this.url = `${this.options.scheme}://${this.options.baseUrl}`;
  }
}
