import Auth from '../../common/auth-types';
import NoneSigner from './none-signer';
import WsseSigner from './wsse-signer';

export default {
  create(authType, authParams) {
    switch (authType) {
      case Auth.wsse:
        return new WsseSigner(authParams);
      case Auth.none:
        return new NoneSigner();
      default:
        throw new Error(`Unknown authentication type "${authType}"`);
    }
  }
};
