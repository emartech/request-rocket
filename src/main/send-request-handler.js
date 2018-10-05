export default class Handler {
  httpClient;
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  static createIpcResponse(httpResponse) {
    return { body: httpResponse.data };
  }

  async handle(event, args) {
    const response = await this.httpClient.get(args.url);
    const message = Handler.createIpcResponse(response);
    event.sender.send('receive-response', message);
  }
}
