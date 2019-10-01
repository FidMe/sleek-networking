import nodeFetch from 'node-fetch';
import ResponseFormatter from './response-formatter';
import Request from './request';
import Response from './response';

export class Api {
  constructor(options) {
    this.mantadoryParams = ['scheme', 'baseUrl'];
    this.fetch = options.fetch || nodeFetch;
    this.options = {
      afterEach: [],
      onError: [],
      retriesCount: 1,
      headers: {},
      ...options,
    };
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

  async request(path, method, body, opts = {}) {
    const options = {
      ...this.options,
      ...opts,
    };

    try {
      this.currentRequest = new Request(this.url, path, method, body, options, this.fetch);
      const response = await this.currentRequest.process();
      const formattedResponse = new ResponseFormatter(response).format();
      this.options.afterEach.forEach(async fn => fn(await formattedResponse));

      return formattedResponse;
    } catch (error) {
      this.options.onError.forEach(async fn => fn(error));
      return new Response({ error });
    }
  }

  validateOptions() {
    this.mantadoryParams.forEach((mandatoryParam) => {
      if (!this.options[mandatoryParam]) throw new Error(`Missing ${mandatoryParam}`);
    });
    this.url = `${this.options.scheme}://${this.options.baseUrl}`;
  }
}
