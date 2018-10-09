export default class WsseSigner {
  crypto;

  constructor(crypto) {
    this.crypto = crypto;
  }

  createNonce() {
    const hex = this.crypto.lib.WordArray.random(16).toString(this.crypto.enc.Hex);
    return hex.substring(hex.length - 32);
  }

  static createTimestamp() {
    return new Date().toISOString();
  }

  createDigest(nonce, timestamp, secret) {
    const hex = this.crypto.SHA1(`${nonce}${timestamp}${secret}`).toString(this.crypto.enc.Hex);
    return this.crypto.enc.Utf8.parse(hex).toString(this.crypto.enc.Base64);
  }

  static getHeader(key, digest, nonce, timestamp) {
    const value = `UsernameToken Username="${key}", PasswordDigest="${digest}", Nonce="${nonce}", Created="${timestamp}"`;
    return { 'x-wsse': value };
  }
}
