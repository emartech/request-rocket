import ResponseFormatter from '../../../../src/main/response-formatter';

describe('ResponseFormatter', () => {
  describe('.transform', () => {
    it('should transform the Axios response to a front-end acceptable format', () => {
      const response = {
        headers: { 'content-type': 'application/json' },
        body: '{}',
        statusCode: 200,
        request: {
          headers: { 'user-agent': 'some-user-agent' }
        },
        timings: { end: 101 }
      };

      expect(ResponseFormatter.transform(response)).to.eql({
        response: {
          headers: { 'content-type': 'application/json' },
          body: '{}',
          status: 200,
          elapsedTime: 101
        },
        requestHeaders: { 'user-agent': 'some-user-agent' }
      });
    });
  });
});
