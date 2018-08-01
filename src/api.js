import ResponseFormatter from "./response-formatter";
import Request from "./request";

export class Api {
  constructor(options) {
    this.mantadoryParams = ["scheme", "baseUrl"];
    this.options = {
      afterEach: [],
      retriesCount: 1,
      headers: {},
      ...options
    };
    this.validateOptions();
  }

  get(url, options = {}) {
    return this.request(url, "get", undefined, options);
  }

  post(url, body = {}, options = {}) {
    return this.request(url, "post", body, options);
  }

  put(url, body = {}, options = {}) {
    return this.request(url, "put", body, options);
  }

  delete(url, options = {}) {
    return this.request(url, "delete", undefined, options);
  }

  async request(path, method, body, options = {}) {
    this.currentRequest = new Request(this.url, path, method, body, {
      ...this.options,
      ...options
    });
    const response = await this.currentRequest.process();
    const formattedResponse = new ResponseFormatter(response).format();
    this.options.afterEach.forEach(async fn => fn(await formattedResponse));
    return formattedResponse;
  }

  validateOptions() {
    this.mantadoryParams.forEach(mandatoryParam => {
      if (!this.options[mandatoryParam])
        throw new Error(`Missing ${mandatoryParam}`);
    });
    this.url = `${this.options.scheme}://${this.options.baseUrl}`;
  }
}
