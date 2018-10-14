export default {
  transform(response) {
    return {
      response: {
        headers: response.headers,
        body: response.data,
        status: response.status
      },
      requestHeaders: response.request.getHeaders()
    };
  }
};
