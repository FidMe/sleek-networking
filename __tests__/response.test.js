import Response from '../src/response';

describe('Response', () => {
  it('should set body, status, headers on succes request', () => {
    const response = new Response({ body: 'coucou', headers: 'lol', status: 200 });
    expect(response.body).toEqual('coucou');
    expect(response.headers).toEqual('lol');
    expect(response.status).toEqual(200);
  });

  describe('didNetworkFail', () => {
    it('detects network errors', async () => {
      let response;
      try {
        throw new TypeError('Network request failed');
      } catch (error) {
        response = new Response({ error });
      }

      expect(response.didNetworkFail).toEqual(true);

      response = new Response({});
      expect(response.didNetworkFail).toBeFalsy();
    });
  });

  describe('didServerFail', () => {
    it('returns true if request status is beyond 500', () => {
      expect(new Response({ status: 500 }).didServerFail).toBeTruthy();
      expect(new Response({ status: 501 }).didServerFail).toBeTruthy();
      expect(new Response({ status: 503 }).didServerFail).toBeTruthy();
      expect(new Response({ status: 200 }).didServerFail).toBeFalsy();
      expect(new Response({ status: undefined }).didServerFail).toBeFalsy();
    });
  });

  describe('succeeded', () => {
    it('returns true if request status is among 200-300', () => {
      expect(new Response({ status: 200 }).succeeded).toBeTruthy();
      expect(new Response({ status: 299 }).succeeded).toBeTruthy();
      expect(new Response({ status: 250 }).succeeded).toBeTruthy();
      expect(new Response({ status: 300 }).succeeded).toBeFalsy();
    });
  });

  describe('bodyIfSucceeded', () => {
    it('returns body if request was successfull', () => {
      expect(new Response({ status: 200, body: 'coucou' }).bodyIfSucceeded).toEqual('coucou');
      expect(new Response({ status: 300, body: 'lol' }).bodyIfSucceeded).toEqual(false);
    });
  });

  describe('bodyOrThrow', () => {
    it('throws when request failed', () => {
      expect(() => new Response({ error: 'lol' }).bodyOrThrow).toThrow();
    });

    it('returns body otherwise', () => {
      expect(new Response({ body: 'lol', status: 200 }).bodyOrThrow).toEqual('lol');
    });
  });

  describe('error', () => {
    it('can be filled by body content', () => {
      const response = new Response({
        body: {
          error: 'problem',
          errors: {
            coucou: 'has a probleme',
          },
        },
        status: 400,
      });
      expect(response.error.message).toEqual('problem');
    });
  });
});
