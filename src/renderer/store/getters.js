import HttpMethodOptions from './method-options';
import Auth from '../../common/auth-types';

export default {
  isWsseAuthSelected: state => state.auth.selected.id === Auth.wsse,
  isNetworkAvailable: state => state.networkStatus === 'online',
  responseType: state => {
    const { headers } = state.response;

    if (headers && headers['content-type']) {
      const [contentType] = headers['content-type'].split(';');
      return contentType;
    }

    return 'application/json';
  },
  isRequestBodyEditAvailable: state =>
    HttpMethodOptions.find(option => option.id === state.request.method).isBodyAllowed
};
