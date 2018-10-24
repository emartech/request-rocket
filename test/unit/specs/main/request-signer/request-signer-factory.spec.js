import RequestSignerFactory from '../../../../../src/main/request-signer/request-signer-factory';
import WsseSigner from '../../../../../src/main/request-signer/wsse-signer';
import NoneSigner from '../../../../../src/main/request-signer/none-signer';
import Auth from '../../../../../src/common/auth-types';
import EscherSigner from '../../../../../src/main/request-signer/escher-signer';

describe('RequestSignerFactory', () => {
  describe('.create', () => {
    context('when WSSE auth is used', () => {
      it('should instantiate a WSSE signer', () => {
        const signer = RequestSignerFactory.create(Auth.WSSE, { key: '', secret: '' });

        expect(signer).to.be.an.instanceof(WsseSigner);
      });
    });

    context('when no auth is used', () => {
      it('should instantiate a none signer', () => {
        const signer = RequestSignerFactory.create(Auth.NONE);

        expect(signer).to.be.an.instanceof(NoneSigner);
      });
    });

    context('when Escher auth is used', () => {
      it('should instantiate an Escher signer', () => {
        const signer = RequestSignerFactory.create(Auth.ESCHER, { key: '', secret: '', credentialScope: '' });

        expect(signer).to.be.an.instanceof(EscherSigner);
      });
    });

    context('when an unknown auth method is used', () => {
      it('should throw an error', () => {
        expect(() => {
          RequestSignerFactory.create('unknown-auth');
        }).to.throw('Unknown authentication type "unknown-auth"');
      });
    });
  });
});
