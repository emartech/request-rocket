import axios from 'axios';

export default class RestClient {
  constructor(timeoutInMilliseconds = 60000) {
    this.client = axios.create({
      transformResponse: response => response,
      timeout: timeoutInMilliseconds,
      headers: {
        common: {
          'User-Agent': 'RequestRocket/0.0.1'
        }
      }
    });
  }

  async send(requestOptions) {
    try {
      return await this.client.request(requestOptions);
    } catch (error) {
      if (error.response) {
        return error.response;
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out');
      } else {
        throw new Error('Unexpected error occurred');
      }
    }
  }
}
