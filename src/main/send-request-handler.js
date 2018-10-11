import createSigner from './signer/signer-factory';

export default class Handler {
  httpClient;

  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  static createHttpRequest({ url, authType, authParams }) {
    const signer = createSigner(authType);
    const headers = signer(authParams);
    return { url, headers };
  }

  static createIpcResponse(httpResponse) {
    return {
      response: {
        body: httpResponse.data,
        headers: httpResponse.headers,
        status: httpResponse.status
      },
      requestHeaders: httpResponse.request.getHeaders()
    };
  }

  async sendHttpRequest({ url, headers }) {
    try {
      return await this.httpClient.get(url, { headers });
    } catch (error) {
      return error.response || { data: null, headers: null };
    }
  }

  async handle(event, args) {
    const request = Handler.createHttpRequest(args);
    const httpResponse = await this.sendHttpRequest(request);

    const ipcResponse = Handler.createIpcResponse(httpResponse);
    await event.sender.send('receive-response', ipcResponse);
  }
}
