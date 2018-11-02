import HeaderValidator from '../../../../../../src/renderer/lib/validator-rules/header-validator';

describe('HeaderValidator', () => {
  describe('.validationErrors', () => {
    context('when there were no headers', () => {
      it('should return null', () => {
        expect(HeaderValidator.validationError([])).to.eql(null);
      });
    });
    context('when there are headers without a proper name', () => {
      it('should indicate error on missing', () => {
        expect(HeaderValidator.validationError([{ sendingStatus: true }])).to.eql({
          type: 'header',
          message: 'Header name cannot be empty'
        });
      });
      it('should indicate error on emoty', () => {
        expect(HeaderValidator.validationError([{ sendingStatus: true, name: '' }])).to.eql({
          type: 'header',
          message: 'Header name cannot be empty'
        });
      });
      it('should indicate error on whitespace only', () => {
        expect(HeaderValidator.validationError([{ sendingStatus: true, name: '   ' }])).to.eql({
          type: 'header',
          message: 'Header name cannot be empty'
        });
      });
    });
  });
});
