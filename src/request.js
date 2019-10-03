import { formatBodyContent, getUrl, timeoutHandler } from './helpers';

export default class Request {
  constructor(url, path, method, body, options, fetch) {
    this.url = url;
    this.fetch = fetch;
    this.path = path;
    this.method = method;
    this.body = body;
    this.timestamp = Math.round(Date.now() / 1000);
    this.options = options;
  }

  process() {
    return this.fetchRetry(
      getUrl(this.url, this.path),
      {
        headers: this.headers(),
        body: formatBodyContent(this.body),
        method: this.method,
        timeout: this.options.timeout || 0,
      },
      this.options.retriesCount,
    );
  }

  async fetchRetry(url, fetchOptions, n) {
    try {
      return await Promise.race([
        timeoutHandler(fetchOptions.timeout),
        this.fetch(url, fetchOptions),
      ]);
    } catch (err) {
      if (n === 0) throw err;
      return this.fetchRetry(url, fetchOptions, n - 1);
    }
  }

  headers() {
    const retrievedValuesOfHeaders = {};
    const headersAsArray = Object.entries(this.options.headers);

    headersAsArray.forEach((value) => {
      retrievedValuesOfHeaders[value[0]] = typeof value[1] === 'function' ? value[1](this) : value[1];
    });

    return retrievedValuesOfHeaders;
  }
}
