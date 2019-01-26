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
    // try {
    //   const timeTracker = new TimeTracker(async () => this.client.request(requestOptions));
    //   const response = await timeTracker.execute();
    //   response.elapsedTime = timeTracker.elapsedTime;
    //
    //   return response;
    // } catch (error) {
    //   if (error.response) {
    //     return error.response;
    //   }
    //   if (error.code === 'ECONNABORTED') {
    //     throw new Error('Request timed out');
    //   } else {
    //     throw new Error('Unexpected error occurred');
    //   }
    // }
  }
}
