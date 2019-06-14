export default class Response {
  constructor({
    body, headers, status, error,
  }) {
    this.body = body;
    this.headers = headers;
    this.status = status;
    this.error = error;

    this.checkErrorsInRequestBody();
  }

  checkErrorsInRequestBody() {
    if (!this.error && this.body && (this.body.error || this.body.errors)) {
      this.error = { message: this.body.error || this.body.errors };
    }
  }

  get didNetworkFail() {
    return (this.error && this.error.message === 'Network request failed');
  }

  get didServerFail() {
    return this.status >= 500;
  }

  get bodyIfSucceeded() {
    return this.succeeded ? this.body : false;
  }

  get bodyOrThrow() {
    if (this.succeeded) return this.body;
    throw this.error;
  }

  get succeeded() {
    return (!this.error
        && this.status >= 200
        && this.status < 300)
        || this.status === 422;
  }
}
