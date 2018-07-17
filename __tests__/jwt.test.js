import { Jwt } from '../src';
import JWS from 'jsrsasign';

test('Jwt throws error when no secret given', () => {
  expect(() => new Jwt()).toThrowError('You must pass a secret');
});

test('generateToken returns valid token', () => {
  const token = new Jwt('123').generateToken();
  expect(JWS.jws.JWS.verify(token, '123', ['HS256'])).toBeTruthy();
});

test('generateToken can retrieve constructor payload', () => {
  const token = new Jwt('123', { coucou: 'ça va ?' }).generateToken();
  const decodedPayload = JWS.jws.JWS.readSafeJSONString(JWS.b64utoutf8(token.split(".")[1]));

  expect(decodedPayload).toEqual({ coucou: 'ça va ?' });
});

test('generateToken can add custom payload', () => {
  const token = new Jwt('123').generateToken({ coucou: 'ça va ?' });
  const decodedPayload = JWS.jws.JWS.readSafeJSONString(JWS.b64utoutf8(token.split(".")[1]));
  
  expect(decodedPayload).toEqual({ coucou: 'ça va ?' });
});