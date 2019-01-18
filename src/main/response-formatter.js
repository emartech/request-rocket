export default {
  transform({ body, headers, statusCode, request, timings }) {
    return {
      response: { body, headers, status: statusCode, elapsedTime: timings.end },
      requestHeaders: request.headers
    };
  }
};
