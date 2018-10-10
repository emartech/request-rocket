import createSigner from './signer/signer-factory';

export default class Handler {
  httpClient;

  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  static createIpcResponse(httpResponse) {
    return {
      body: httpResponse.data,
      headers: httpResponse.headers,
    };
  }

  async handle(event, { url, authType, authParams }) {
    const signer = createSigner(authType);
    const headers = signer(authParams);

    let response;
    try {
      response = await this.httpClient.get(url, { headers });
    } catch (error) {
      response = error.response || { data: null, headers: null };
    }
    const message = Handler.createIpcResponse(response);
    await event.sender.send('receive-response', message);
  }
}
