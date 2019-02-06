import { promisify } from 'util';
import request from 'request';
const { version } = require('../../../../package');

export default class RestClient {
  constructor(timeoutInMilliseconds = 60000) {
    this.makeRequest = promisify(
      request.defaults({
        timeout: timeoutInMilliseconds,
        time: true,
        headers: {
          'user-agent': `RequestRocket/${version}`
        }
      })
    );
  }

  send(requestOptions) {
    return this.makeRequest(requestOptions);
  }
}
