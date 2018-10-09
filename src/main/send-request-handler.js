import createSigner from './signer/signer-factory';

export default class Handler {
  httpClient;
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  static createIpcResponse(httpResponse) {
    return { body: httpResponse.data };
  }

  async handle(event, { url, authType, authParams }) {
    const signer = createSigner(authType);
    const headers = signer(authParams);

    const response = await this.httpClient.get(url, { headers });
    const message = Handler.createIpcResponse(response);
    await event.sender.send('receive-response', message);
  }
}
