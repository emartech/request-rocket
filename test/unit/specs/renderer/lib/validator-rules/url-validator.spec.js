import UrlValidator from '../../../../../../src/renderer/lib/validator-rules/url-validator';

describe('UrlValidator', () => {
  describe('.validationErrors', () => {
    context('when a proper URL is provided', () => {
      it('should return null', () => {
        expect(UrlValidator.validationError('https://index.hu')).to.eql(null);
      });
    });
    context('when the provided string is empty', () => {
      it('should indicate missing URL', () => {
        expect(UrlValidator.validationError('')).to.eql({ type: 'url', message: 'URL cannot be empty' });
      });
    });
    context('when the provided string can not be parsed as an URL', () => {
      it('should indicate malformed URL', () => {
        expect(UrlValidator.validationError('almafa')).to.eql({ type: 'url', message: 'URL is malformed' });
      });
    });
  });
});
