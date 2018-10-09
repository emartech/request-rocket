import CryptoJS from 'crypto-js';
import WsseSigner from './signer/wsse';
import Auth from '../common/auth-types';

export default class Handler {
  httpClient;
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  static createIpcResponse(httpResponse) {
    return { body: httpResponse.data };
  }

  static createSigner(authType) {
    if (authType === Auth.wsse) {
      return ({ key, secret }) => {
        const wsseSigner = new WsseSigner(CryptoJS);
        const nonce = wsseSigner.createNonce();
        const timestamp = WsseSigner.createTimestamp();
        const digest = wsseSigner.createDigest(nonce, timestamp, secret);

        return WsseSigner.getHeader(key, digest, nonce, timestamp);
      };
    }
    return () => ({});
  }

  async handle(event, { url, authType, authParams }) {
    const signer = Handler.createSigner(authType);
    const headers = signer(authParams);

    const response = await this.httpClient.get(url, { headers });
    const message = Handler.createIpcResponse(response);
    await event.sender.send('receive-response', message);
  }
}
