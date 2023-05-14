import jwt from 'jsonwebtoken';
import config from '../config';

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  const key = getPrivateKey();
  // jwt.sign function will encode user object, so when decode this jwt token, you will get user object
  return key
    ? jwt.sign(object, key, {
        ...(options && options),
        algorithm: 'HS256',
      })
    : null;
}

export function verifyJwt<T>(token: string): T | null {
  try {
    const key = getPrivateKey();
    return key ? (jwt.verify(token, key) as T) : null;
  } catch (e) {
    return null;
  }
}

function getPrivateKey() {
  const publicKey = config.privateKey;
  if (!publicKey) {
    console.error('publicKey not found');
    return null;
  }

  return publicKey;
}
