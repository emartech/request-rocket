import AuthValidator from './validator-rules/auth-validator';
import HeaderValidator from './validator-rules/header-validator';
import UrlValidator from './validator-rules/url-validator';

export default {
  execute(applicationState) {
    const validationErrors = [];

    validationErrors.push(AuthValidator.validationError(applicationState.auth));
    validationErrors.push(HeaderValidator.validationError(applicationState.request.headers));
    validationErrors.push(UrlValidator.validationError(applicationState.request.url));

    return validationErrors.filter(error => error !== null);
  }
};
