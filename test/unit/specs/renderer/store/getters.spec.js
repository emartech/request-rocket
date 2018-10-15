import Getter from '../../../../../src/renderer/store/getters';
import HttpMethods from '../../../../../src/common/method-types';

describe('getters', () => {
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
});
