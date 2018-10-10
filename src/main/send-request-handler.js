import createSigner from './signer/signer-factory';

export default class Handler {
  httpClient;

  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  static createIpcResponse(httpResponse) {
    return {
      body: httpResponse.data,
      headers: httpResponse.headers
    };
  }

  async handle(event, { url, authType, authParams }) {
    const signer = createSigner(authType);
    const headers = signer(authParams);

    let httpResponse;
    try {
      httpResponse = await this.httpClient.get(url, { headers });
    } catch (error) {
      httpResponse = error.response || { data: null, headers: null };
    }
    const ipcResponse = Handler.createIpcResponse(httpResponse);
    await event.sender.send('receive-response', ipcResponse);
  }
}
