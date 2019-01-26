import { promisify } from 'util';
import request from 'request';

export default class RestClient {
  constructor(timeoutInMilliseconds = 60000) {
    this.makeRequest = promisify(
      request.defaults({
        timeout: timeoutInMilliseconds,
        time: true,
        headers: {
          'user-agent': 'RequestRocket/1.1.1'
        }
      })
    );
  }

  send(requestOptions) {
    return this.makeRequest(requestOptions);
  }
}
