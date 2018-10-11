export default {
  authTypes: state => state.auth.types,
  selectedAuthTypeId: state => state.auth.selected.id,
  authParams: state => state.auth.params,
  isNetworkAvailable: state => state.networkStatus === 'online'
};
