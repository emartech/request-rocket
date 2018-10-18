import { clone } from 'ramda';
import HttpMethodOptions from './method-options';
import Auth from '../../common/auth-types';

export default {
  isWsseAuthSelected: state => state.auth.selected === Auth.WSSE,
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
    HttpMethodOptions.find(option => option.id === state.request.method).isBodyAllowed,
  requestHeadersWithEmptyRow: state => {
    const headers = clone(state.request.headers);
    const lastItemIndex = headers.length - 1;
    if (!(headers[lastItemIndex].name === '' && headers[lastItemIndex].value === '')) {
      headers.push({ name: '', value: '' });
    }
    return headers;
  }
};
