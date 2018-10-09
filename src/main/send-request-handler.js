export default class Handler {
  httpClient;
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  static createIpcResponse(httpResponse) {
    return { body: httpResponse.data };
  }

  async handle(event, { url }) {
    const response = await this.httpClient.get(url);
    const message = Handler.createIpcResponse(response);
    await event.sender.send('receive-response', message);
  }
}
