import ResponseFormatter from '../../../../src/main/response-formatter';

describe('ResponseFormatter', () => {
  describe('.transform', () => {
    it('should transform the Axios response to a front-end acceptable format', () => {
      const axiosResponse = {
        headers: { 'content-type': 'application/json' },
        data: '{}',
        status: 200,
        request: {
          getHeaders() {
            return { 'user-agent': 'some-user-agent' };
          }
        }
      };

      expect(ResponseFormatter.transform(axiosResponse)).to.eql({
        response: {
          headers: { 'content-type': 'application/json' },
          body: '{}',
          status: 200
        },
        requestHeaders: { 'user-agent': 'some-user-agent' }
      });
    });
  });
});
