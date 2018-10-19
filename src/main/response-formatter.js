export default {
  transform({ data, headers, status, request, elapsedTime }) {
    return {
      response: { body: data, headers, status, elapsedTime },
      requestHeaders: request.getHeaders()
    };
  }
};
