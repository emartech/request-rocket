import CryptoJS from 'crypto-js';
import { clone } from 'ramda';

function randomNonce() {
  const hex = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
  return hex.substring(hex.length - 32);
}

function currentTimestamp() {
  return new Date().toISOString();
}

function calculateDigest(nonce, timestamp, secret) {
  const hex = CryptoJS.SHA1(`${nonce}${timestamp}${secret}`).toString(CryptoJS.enc.Hex);
  return CryptoJS.enc.Utf8.parse(hex).toString(CryptoJS.enc.Base64);
}

function composeHeader(key, digest, nonce, timestamp) {
  return `UsernameToken Username="${key}", PasswordDigest="${digest}", Nonce="${nonce}", Created="${timestamp}"`;
}

export default class WsseSigner {
  constructor({ key, secret }) {
    this.key = key;
    this.secret = secret;
  }

  signRequest(request) {
    const nonce = randomNonce();
    const created = currentTimestamp();
    const digest = calculateDigest(nonce, created, this.secret);

    const headerContent = composeHeader(this.key, digest, nonce, created);

    const copyOfOriginalRequest = clone(request);

    copyOfOriginalRequest.headers['x-wsse'] = headerContent;

    return copyOfOriginalRequest;
  }
}
