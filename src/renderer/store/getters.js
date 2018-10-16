import HttpMethods from '../../common/method-types';
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
  isRequestBodyEditAvailable: state => ![HttpMethods.GET, HttpMethods.HEAD].includes(state.request.method)
};
