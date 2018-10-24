import Auth from '../../common/auth-types';
import NoneSigner from './none-signer';
import WsseSigner from './wsse-signer';
import EscherSigner from './escher-signer';

export default {
  create(authType, authParams) {
    switch (authType) {
      case Auth.WSSE:
        return new WsseSigner(authParams);
      case Auth.ESCHER:
        return new EscherSigner();
      case Auth.NONE:
        return new NoneSigner();
      default:
        throw new Error(`Unknown authentication type "${authType}"`);
    }
  }
};
