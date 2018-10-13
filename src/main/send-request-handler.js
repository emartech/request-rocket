import createSigner from './signer/signer-factory';

export default class Handler {
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
      if (error.response) {
        return error.response;
      } else if (error.code === 'ECONNABORTED') {
        throw new Error(error.message);
      }
      throw new Error('Unexpected error occurred.');
    }
  }

  async handle(event, args) {
    const request = Handler.createHttpRequest(args);
    const httpResponse = await this.sendHttpRequest(request);
    const ipcResponse = Handler.createIpcResponse(httpResponse);
    event.sender.send('receive-response', ipcResponse);
  }
}
