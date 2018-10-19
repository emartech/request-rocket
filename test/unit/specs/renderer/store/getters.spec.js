import Getter from '../../../../../src/renderer/store/getters';
import HttpMethods from '../../../../../src/common/method-types';
import Auth from '../../../../../src/common/auth-types';

describe('Getters', () => {
  describe('.isNetworkAvailable', () => {
    it('should return true when networkStatus is online', function() {
      const state = { networkStatus: 'online' };
      expect(Getter.isNetworkAvailable(state)).to.be.eql(true);
    });
    it('should return false when networkStatus is offline', function() {
      const state = { networkStatus: 'offline' };
      expect(Getter.isNetworkAvailable(state)).to.be.eql(false);
    });
  });
  describe('.responseType', () => {
    it('should return application/json by default', function() {
      const state = { response: {} };
      expect(Getter.responseType(state)).to.be.eql('application/json');
    });

    it('should return response type when a response arrived', function() {
      const state = {
        response: {
          headers: { 'content-type': 'text/plain' }
        }
      };
      expect(Getter.responseType(state)).to.be.eql('text/plain');
    });

    it('should return only the response type when a response arrived', function() {
      const state = {
        response: {
          headers: { 'content-type': 'text/plain; charset=utf-8' }
        }
      };
      expect(Getter.responseType(state)).to.be.eql('text/plain');
    });
  });
  describe('.isRequestBodyEditAvailable', () => {
    [
      { method: HttpMethods.GET, expectedReturnValue: false },
      { method: HttpMethods.HEAD, expectedReturnValue: false },
      { method: HttpMethods.POST, expectedReturnValue: true },
      { method: HttpMethods.PUT, expectedReturnValue: true },
      { method: HttpMethods.PATCH, expectedReturnValue: true },
      { method: HttpMethods.OPTIONS, expectedReturnValue: true }
    ].forEach(({ method, expectedReturnValue }) => {
      it(`should return ${expectedReturnValue} when the ${method} request method is selected`, function() {
        const state = { request: { method } };
        expect(Getter.isRequestBodyEditAvailable(state)).to.be.eql(expectedReturnValue);
      });
    });
  });
  describe('.isWsseAuthSelected', () => {
    it('should return false if the selected auth type is not wsse', function() {
      const state = { auth: { selected: 'not-wsse' } };
      expect(Getter.isWsseAuthSelected(state)).to.be.eql(false);
    });

    it('should return true if the selected auth type is wsse', function() {
      const state = { auth: { selected: Auth.WSSE } };
      expect(Getter.isWsseAuthSelected(state)).to.be.eql(true);
    });
  });
  describe('.requestHeadersWithEmptyRow', () => {
    it('should append an empty header to the end of the headers', () => {
      const state = {
        request: {
          headers: []
        }
      };
      expect(Getter.requestHeadersWithEmptyRow(state)).to.be.eql([{ name: '', value: '', sendingStatus: true }]);
    });
    context('when the headers are not empty', () => {
      it('should append an empty header to the end of the headers', () => {
        const state = {
          request: {
            headers: [
              { name: 'my-header', value: 'my-header-value' },
              { name: 'other-header', value: 'other-header-value' }
            ]
          }
        };
        const expectedHeaders = [
          { name: 'my-header', value: 'my-header-value' },
          { name: 'other-header', value: 'other-header-value' },
          { name: '', value: '', sendingStatus: true }
        ];
        expect(Getter.requestHeadersWithEmptyRow(state)).to.be.eql(expectedHeaders);
      });
    });
    it('should not extend headers obejct with empty header', () => {
      const state = {
        request: {
          headers: [
            { name: 'my-header', value: 'my-header-value' },
            { name: 'other-header', value: 'other-header-value' },
            { name: '', value: '' }
          ]
        }
      };
      const expectedHeaders = [
        { name: 'my-header', value: 'my-header-value' },
        { name: 'other-header', value: 'other-header-value' },
        { name: '', value: '' }
      ];
      expect(Getter.requestHeadersWithEmptyRow(state)).to.be.eql(expectedHeaders);
    });
  });
  describe('.requestHeadersToSend', () => {
    it('should return headers with sending status true', () => {
      const state = {
        request: {
          headers: [
            { name: 'my-header', value: 'my-header-value', sendingStatus: true },
            { name: 'other-header', value: 'other-header-value', sendingStatus: false }
          ]
        }
      };
      const expectedHeaders = [{ name: 'my-header', value: 'my-header-value', sendingStatus: true }];
      expect(Getter.requestHeadersToSend(state)).to.be.eql(expectedHeaders);
    });
  });
});
