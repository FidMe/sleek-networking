import Response from './response';

class ResponseFormatter {
  constructor(response) {
    this.response = response;
  }

  async format() {
    const returnFormattedResponse = body => new Response({
      body,
      status: this.response.status,
      headers: this.response.headers,
    });

    const methodToApply = (await this.isJsonResponse()) ? 'json' : 'text';
    return this.response[methodToApply]().then(body => returnFormattedResponse(body));
  }

  async isJsonResponse() {
    try {
      const seeIfResponseIsJSON = this.response.clone();
      await seeIfResponseIsJSON.json();
      return true;
    } catch (notAJSON) {
      return false;
    }
  }
}

export default ResponseFormatter;
