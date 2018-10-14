import RequestFactory from '../../../../src/main/request-factory';

describe('RequestFactory', () => {
  describe('.create', () => {
    it('should convert ipcParams to Axios acceptable request options', () => {
      const ipcRequest = {
        method: 'GET',
        url: 'https://example.com',
        headers: [],
        body: 'some request body'
      };

      expect(RequestFactory.create(ipcRequest)).to.eql({
        method: 'GET',
        url: 'https://example.com',
        headers: {},
        data: 'some request body'
      });
    });
    it('should convert array of header objects to key-value pairs', () => {
      const ipcRequest = {
        method: 'GET',
        url: 'https://example.com',
        headers: [
          { name: 'x-custom-header', value: 'some content' },
          { name: 'content-type', value: 'application/json' }
        ],
        body: 'some request body'
      };

      expect(RequestFactory.create(ipcRequest)).to.eql({
        method: 'GET',
        url: 'https://example.com',
        headers: {
          'x-custom-header': 'some content',
          'content-type': 'application/json'
        },
        data: 'some request body'
      });
    });
    it('should combine headers of the same name to a comma separated value', () => {
      const ipcRequest = {
        method: 'GET',
        url: 'https://example.com',
        headers: [
          { name: 'x-custom-header', value: 'some content' },
          { name: 'x-custom-header', value: 'other content' }
        ],
        body: 'some request body'
      };

      expect(RequestFactory.create(ipcRequest)).to.eql({
        method: 'GET',
        url: 'https://example.com',
        headers: { 'x-custom-header': 'some content,other content' },
        data: 'some request body'
      });
    });
  });
});
