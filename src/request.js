import { formatBodyContent, getUrl } from "./helpers";

export default class Request {
  constructor(url, path, method, body, options) {
    this.url = url;
    this.path = path;
    this.method = method;
    this.body = body;
    this.timestamp = Math.round(Date.now() / 1000);
    this.options = options;
  }

  process() {
    const fetchRetry = async (url, fetchOptions, n) => {
      try {
        return await fetch(url, fetchOptions);
      } catch (err) {
        if (n === 0) throw err;
        return await fetchRetry(url, fetchOptions, n - 1);
      }
    };

    return fetchRetry(
      getUrl(this.url, this.path),
      {
        headers: this.headers(),
        body: formatBodyContent(this.body),
        method: this.method
      },
      this.options.retriesCount
    );
  }

  headers() {
    let retrievedValuesOfHeaders = {};
    const headersAsArray = Object.entries(this.options.headers);

    headersAsArray.forEach(value => {
      retrievedValuesOfHeaders[value[0]] =
        typeof value[1] === "function" ? value[1](this) : value[1];
    });

    return retrievedValuesOfHeaders;
  }
}
