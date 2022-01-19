import token from 'jsrsasign';

export class Jwt {
  constructor(secret, payload = {}, headers = {}) {
    if (!secret) throw new Error('You must pass a secret');

    this.secret = secret;
    this.headers = { alg: 'HS256', typ: 'JWT', ...headers };
    this.payload = payload;
  }

  generateToken(customPayload = {}) {
    const headers = JSON.stringify(this.headers);
    const payload = JSON.stringify({ ...this.payload, ...customPayload });

    return token.jws.JWS.sign(this.headers.alg, headers, payload, this.secret);
  }

  static parseToken(token) {
    try {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(
          atob(base64)
              .split('')
              .map(function(c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join(''),
      );
      
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.log('[Sleek-Networking] parseToken', e);
      return false;
    }
  }
}
