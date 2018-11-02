import AuthValidator from '../../../../../../src/renderer/lib/validator-rules/auth-validator';
import Auth from '../../../../../../src/common/auth-types';

describe('AuthValidator', () => {
  describe('.validationErrors', () => {
    context('when no auth was selected', () => {
      it('should return null', () => {
        expect(AuthValidator.validationError({ selected: Auth.NONE })).to.eql(null);
      });
    });
    context('when auth params are missing', () => {
      it('should indicate error when they are omitted', () => {
        expect(AuthValidator.validationError({ selected: Auth.WSSE })).to.eql({
          type: 'auth',
          message: 'Auth parameters must be provided'
        });
      });
      it('should indicate error when they are empty', () => {
        expect(AuthValidator.validationError({ selected: Auth.WSSE, params: {} })).to.eql({
          type: 'auth',
          message: 'Auth parameters must be provided'
        });
      });
      it('should indicate error when they are partially filled out', () => {
        expect(
          AuthValidator.validationError({
            selected: Auth.WSSE,
            params: { key: '', secret: 'v3ry53cr3t' }
          })
        ).to.eql({
          type: 'auth',
          message: 'All auth parameters must be filled out'
        });
      });
    });
  });
});
