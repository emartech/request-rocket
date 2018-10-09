import CryptoJS from 'crypto-js';
import Auth from '../../common/auth-types';
import WsseSigner from './wsse';

const noneSigner = () => ({});

const wsseSigner = ({ key, secret }) => {
  const wsseSigner = new WsseSigner(CryptoJS);
  const nonce = wsseSigner.createNonce();
  const timestamp = WsseSigner.createTimestamp();
  const digest = wsseSigner.createDigest(nonce, timestamp, secret);

  return WsseSigner.getHeader(key, digest, nonce, timestamp);
};

export default authType => {
  if (authType === Auth.wsse) {
    return wsseSigner;
  }
  return noneSigner;
};
