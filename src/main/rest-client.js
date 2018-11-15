import axios from 'axios';
import TimeTracker from './time-tracker';

export default class RestClient {
  constructor(timeoutInMilliseconds = 60000) {
    this.client = axios.create({
      transformResponse: response => response,
      timeout: timeoutInMilliseconds,
      headers: {
        common: {
          'User-Agent': 'RequestRocket/1.0.0'
        }
      }
    });
    this.client.defaults.headers.post = {};
    this.client.defaults.headers.put = {};
    this.client.defaults.headers.patch = {};
  }

  async send(requestOptions) {
    try {
      const timeTracker = new TimeTracker(async () => this.client.request(requestOptions));
      const response = await timeTracker.execute();
      response.elapsedTime = timeTracker.elapsedTime;

      return response;
    } catch (error) {
      if (error.response) {
        return error.response;
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out');
      } else {
        throw new Error('Unexpected error occurred');
      }
    }
  }
}
