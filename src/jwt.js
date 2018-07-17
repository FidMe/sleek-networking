import token from 'jsrsasign';

export class Jwt {
  constructor(secret, payload = {}, headers = {}) {
    if (!secret) throw 'You must pass a secret';

    this.secret = secret;
    this.headers = { alg: 'HS256', typ: 'JWT', ...headers };
    this.payload = payload;
  }


  generateToken(customPayload = {}) {
    const headers = JSON.stringify(this.headers);
    const payload = JSON.stringify({ ...this.payload, ...customPayload });
    
    return token.jws.JWS.sign(this.headers.alg, headers, payload, this.secret);
  }

}
