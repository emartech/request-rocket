export default {
  transform({ data, headers, status, request }) {
    return {
      response: { body: data, headers, status },
      requestHeaders: request.getHeaders()
    };
  }
};
