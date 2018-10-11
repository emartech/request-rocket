export default {
  authTypes: state => state.auth.types,
  selectedAuthTypeId: state => state.auth.selected.id,
  authParams: state => state.auth.params,
  isNetworkAvailable: state => state.networkStatus === 'online',
  responseType: state => {
    const { headers } = state.response;

    if (headers && headers['content-type']) {
      const [contentType] = headers['content-type'].split(';');
      return contentType;
    }

    return 'application/json';
  }
};
