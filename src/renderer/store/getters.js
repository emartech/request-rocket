import { clone } from 'ramda';
import HttpMethodOptions from './method-options';
import Auth from '../../common/auth-types';

function isEmptyHeaderPresent(headers) {
  const lastItemIndex = headers.length - 1;
  return headers[lastItemIndex].name === '' && headers[lastItemIndex].value === '';
}

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

    if (headers.length === 0 || !isEmptyHeaderPresent(headers)) {
      headers.push({ name: '', value: '', sendingStatus: true });
    }

    return headers;
  },
  requestHeadersToSend: state => state.request.headers.filter(header => header.sendingStatus === true)
};
